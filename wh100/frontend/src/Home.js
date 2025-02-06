import Countdown from "./Countdown";
import { useUser } from "./auth";
import { Link } from "react-router-dom";

export default function Home() {
  const user = useUser();

  return (
    <div className="flex justify-center w-screen h-screen bg-gray-100 overflow-hidden fixed top-0 left-0">
      <div className="justify-center">
        <h2
          className="text-4xl/7 text-center p-4 font-bold sm:truncate sm:text-5xl sm:tracking-tight mt-48 sm:mt-40 mb-4"
          style={{ fontFamily: "FuturaNowBold" }}
        >
          VOTING ENDS IN
        </h2>
        <div className="flex justify-center">
          <Countdown targetDateTime="2025-02-28T00:00:00+11:00" />
        </div>
        {user ? (
          <div className="flex justify-center pt-10">
            <button
              type="button"
              className="flex justify-center text-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-2xl px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-blue-800"
            >
              <Link
                to="/dashboard"
                className="w-full h-full flex items-center justify-center"
              >
                VOTE NOW
              </Link>
            </button>
          </div>
        ) : (
          <div className="flex justify-center pt-10">
            <button
              type="button"
              className="flex justify-center text-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-2xl px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-blue-800"
            >
              <Link
                to="/account/signup"
                className="w-full h-full flex items-center justify-center"
              >
                LOGIN/SIGNUP TO VOTE
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
