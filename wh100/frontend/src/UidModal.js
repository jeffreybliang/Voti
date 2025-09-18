import { useState } from "react";
import Spinner from "./Spinner";
export default function UidModal({
  showUidModal,
  setShowUidModal,
  saveVotes,
  votes,
  setInitialVotes,
}) {
  const [uid, setUid] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfirmSpinner, setShowConfirmSpinner] = useState(false);
  const [uidError, setUidError] = useState("");

  const handleSendLink = async () => {
    if (!uid) return;
    try {
      setIsAnimating(true);
      await saveVotes(uid);
      setShowConfirmSpinner(false);
      setLinkSent(true);
    } catch (e) {
      console.error("Error sending link:", e);
      // Handle error, e.g., show an alert
    } finally {
      setIsAnimating(false);
    }
  };

  const handleCloseModal = () => {
    setShowUidModal(false);
    setLinkSent(false);
  };

  if (!showUidModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-sm mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`transition-all duration-300 ${
            !linkSent
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 w-full text-center">
            <h3
              className="text-xl font-semibold text-gray-900 dark:text-white"
              style={{ fontFamily: "AdamCG" }}
            >
              Almost there!
            </h3>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-400">
              Enter your ANU uID to confirm!
            </p>
          </div>
          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="u1234567"
              value={uid}
              onChange={(e) => {
                const value = e.target.value;
                const validRegex = /^[uU]\d{0,7}$/;

                if (
                  value === "" ||
                  value.toLowerCase() === "u" ||
                  validRegex.test(value)
                ) {
                  setUid(value);
                }
              }}
              maxLength={8}
              className="w-32 px-5 h-10 text-lg rounded-lg border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {/* Error message display */}
            {uidError && (
              <p className="mt-2 text-red-700 dark:text-red-400 text-sm text-center">
                {uidError}
              </p>
            )}
          </div>
          <div className="px-6 py-4 flex justify-center space-x-2 border-t border-gray-200 dark:border-gray-700 w-full">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const finalRegex = /^[uU]\d{7}$/;
                if (finalRegex.test(uid)) {
                  // If valid, clear any errors and proceed
                  setUidError("");
                  handleSendLink();
                  setShowConfirmSpinner(true);
                } else {
                  // If invalid, show an error message
                  setUidError(
                    "User ID must start with 'u' and be followed by 7 digits."
                  );
                }
              }}
              className="relative px-4 py-2 rounded-full text-white bg-green-600 hover:bg-green-500"
            >
              <span className={showConfirmSpinner ? "opacity-0" : ""}>
                Confirm & Send
              </span>
              {showConfirmSpinner && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner
                    colorClass="text-green-400"
                    className="w-6 h-6 text-white"
                  />
                </div>
              )}
            </button>
          </div>
        </div>{" "}
        <div
          className={`absolute inset-0 transition-all duration-300 flex flex-col justify-center items-center text-center px-6 py-6 ${
            linkSent
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {linkSent && (
            <>
              <h3
                className="text-xl font-semibold text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "AdamCG" }}
              >
                Link Sent! 🚀
              </h3>
              <p className="mt-2 text-lg text-gray-700 dark:text-gray-200">
              We've sent a link to your ANU email. Click it to confirm your
              vote, and you're all done!
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    handleCloseModal();
                    setInitialVotes(votes);
                  }}
                  className="px-6 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-500"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
