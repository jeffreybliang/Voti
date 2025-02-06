import { useState } from 'react';
import {
  useLoaderData,
  Navigate
} from 'react-router-dom';
import { getEmailVerification, verifyEmail } from '../lib/allauth';
import Button from '../components/Button';

export async function loader({ params }) {
  const key = params.key;
  const resp = await getEmailVerification(key);
  return { key, verification: resp };
}

export default function VerifyEmail() {
  const { key, verification } = useLoaderData();
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit() {
    setResponse({ ...response, fetching: true });
    verifyEmail(key)
      .then((content) => {
        setResponse((r) => ({ ...r, content }));
      })
      .catch((e) => {
        console.error(e);
        window.alert(e);
      })
      .then(() => {
        setResponse((r) => ({ ...r, fetching: false }));
      });
  }

  if ([200, 401].includes(response.content?.status)) {
    return <Navigate to='/dashboard' />;
  }

  let body = null;
  if (verification.status === 200) {
    body = (
      <>
        <p className="text-gray-600 mb-4">
          Please confirm that <a href={'mailto:' + verification.data.email} className="text-blue-600 hover:underline">{verification.data.email}</a> is an email address for user {verification.data.user.str}.
        </p>
        <Button disabled={response.fetching} onClick={() => submit()} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Confirm</Button>
      </>
    );
  } else if (!verification.data?.email) {
    body = <p className="text-red-600">Invalid verification link.</p>;
  } else {
    body = <p className="text-gray-600">Unable to confirm email <a href={'mailto:' + verification.data.email} className="text-blue-600 hover:underline">{verification.data.email}</a> because it is already confirmed.</p>;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Email Address</h1>
        {body}
      </div>
    </div>
  );
}
