export default function VerificationEmailSent() {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100 overflow-hidden fixed top-0 left-0">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Email Address</h1>
        <p className="text-gray-600">Please confirm your email address.</p>
      </div>
    </div>
  );
}
