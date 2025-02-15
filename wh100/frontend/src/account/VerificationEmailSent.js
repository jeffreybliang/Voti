export default function VerificationEmailSent() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat bg-fixed -z-10" />

      <div className="flex justify-center items-center w-screen h-screen overflow-hidden fixed top-0 left-0">
        <div className="max-w-md w-full bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Confirm Email Address
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please confirm your email address.
          </p>
        </div>
      </div>
    </>
  );
}
