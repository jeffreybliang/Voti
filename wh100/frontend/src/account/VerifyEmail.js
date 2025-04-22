import { useEffect, useState, useRef, useCallback } from "react"; // Added useRef
import { useLoaderData, Navigate } from "react-router-dom";
import { getEmailVerification, verifyEmail } from "../lib/allauth";
import Button from "../components/Button";
import { useOutletContext } from "react-router-dom";

export async function loader({ params }) {
  const key = params.key;
  const resp = await getEmailVerification(key);
  return { key, verification: resp };
}

export default function VerifyEmail() {
  const { key, verification } = useLoaderData();
  const [response, setResponse] = useState({ fetching: false, content: null });
  const { emailAddresses, setEmailAddresses } = useOutletContext(); // Use the context for emailAddresses

  // Use a ref to track verification status
  const isVerifiedRef = useRef(false);

  // Temporarily mark all emails as verified
  const temporarilyVerifyEmails = useCallback(() => {
    const updatedEmails = emailAddresses.map((email) => ({
      ...email,
      verified: true,
    }));
    setEmailAddresses(updatedEmails); // Update the context state directly
    localStorage.setItem("emailAddresses", JSON.stringify(updatedEmails)); // Also update localStorage
    window.dispatchEvent(new Event("storage")); // Trigger storage event
  }, [emailAddresses, setEmailAddresses]);

  // Revert verification status to false
  const revertEmailVerification = useCallback(() => {
    const originalEmails = emailAddresses.map((email) => ({
      ...email,
      verified: false,
    }));
    setEmailAddresses(originalEmails); // Revert context state directly
    localStorage.setItem("emailAddresses", JSON.stringify(originalEmails)); // Update localStorage
    window.dispatchEvent(new Event("storage")); // Trigger storage event
  }, [emailAddresses, setEmailAddresses]);

  // Handle initial verification and cleanup
  useEffect(() => {
    temporarilyVerifyEmails(); // Mark all emails as verified

    const handleBeforeUnload = () => {
      if (!isVerifiedRef.current) {
        revertEmailVerification(); // Revert if not verified
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (!isVerifiedRef.current) {
        revertEmailVerification(); // Cleanup on component unmount
      }
    };
  }, [
    emailAddresses,
    setEmailAddresses,
    temporarilyVerifyEmails,
    revertEmailVerification,
  ]); // Dependencies updated to include context state

  function submit() {
    setResponse({ ...response, fetching: true });
    verifyEmail(key)
      .then((content) => {
        setResponse((r) => ({ ...r, content }));
        if ([200, 401].includes(content.status)) {
          isVerifiedRef.current = true; // Mark as verified
        }
      })
      .catch((e) => {
        console.error(e);
        window.alert(e);
        revertEmailVerification(); // Revert on API failure
      })
      .finally(() => {
        setResponse((r) => ({ ...r, fetching: false }));
      });
  }

  if ([200, 401].includes(response.content?.status)) {
    return <Navigate to="/vote" />;
  }

  // Rest of your component remains the same...
  let body = null;
  if (verification.status === 200) {
    body = (
      <>
        <p className="text-gray-600 mb-4 dark:text-gray-200">
          Please confirm that{" "}
          <a
            href={"mailto:" + verification.data.email}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {verification.data.email}
          </a>{" "}
          is your email address.
        </p>
        <Button
          disabled={response.fetching}
          onClick={() => submit()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Confirm
        </Button>
      </>
    );
  } else if (!verification.data?.email) {
    body = <p className="text-red-600">Invalid verification link.</p>;
  } else {
    body = (
      <p className="text-gray-600">
        Unable to confirm email{" "}
        <a
          href={"mailto:" + verification.data.email}
          className="text-blue-600 hover:underline"
        >
          {verification.data.email}
        </a>{" "}
        because it is already confirmed.
      </p>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat bg-fixed -z-10" />

      <div className="flex justify-center items-center w-screen h-screen overflow-hidden fixed top-0 left-0">
        <div className="max-w-md w-full bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Confirm Email Address
          </h1>
          {body}
        </div>
      </div>
    </>
  );
}
