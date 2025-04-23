import Countdown from "./Countdown";
import { useUser } from "./auth";
import { Link } from "react-router-dom";
import hottest100logo from './media/hottest100logo.png';
// import hottest100logosolid from './media/hottest100logosolid.png';
// import hottest100logomulti from './media/hottest100logomulti.png';

export const deadline = "2025-07-07T23:59:59+10:00";

export default function Home() {
  const user = useUser();

  return (
<div className="flex justify-center w-screen h-screen bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat bg-fixed fixed top-0 left-0 z-40">
      <div className="justify-center">

      <div className="z-100">
      <img src={hottest100logo} alt="Hottest 100 Logo" className= "mx-auto mt-32 sm:w-[80%] sm:mt-28" />
      </div>
      <div className="flex justify-center">
      <h2
        className="text-3xl/5 text-black backdrop-blur-lg bg-neutral-200/20 dark:bg-neutral-700/20 rounded-lg text-center p-2 pt-4 sm:p-1 sm:pt-2 sm:pl-3 sm:pr-3 font-bold sm:truncate sm:text-3xl sm:tracking-wide mb-4 sm:mb-2 mt-4 sm:mt-2 inline-flex rounded-lg dark:text-white"
        // className="text-3xl/5 text-black backdrop-blur-lg bg-neutral-200/20 dark:bg-neutral-700/20 rounded-lg text-center p-1 pt-2 pl-2 pr-2 font-bold sm:truncate sm:text-3xl sm:tracking-wide mb-4 sm:mb-2 mt-4 sm:mt-2 inline-flex rounded-lg dark:text-white"
        style={{ fontFamily: "FuturaNowBold" }}
      >
        VOTING ENDS IN
      </h2>

      </div>
        <div className="flex justify-center">
          <Countdown targetDateTime={deadline} />
        </div>

        {user ? (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              className="flex justify-center text-center focus:ring-4 focus:ring-red-700 font-medium rounded-full text-2xl px-5 py-2 pt-3 text-white bg-red-700 dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-800 outline outline-red-600 dark:outline-red-700 outline-solid  outline-2 outline-offset-2 dark:focus:ring-red-800 transition-transform duration-150 ease-in-out hover:scale-105"
            >
              <Link
                to="/vote"
                className="w-full h-full flex items-center justify-center"
                style={{ fontFamily: "FuturaNowBold" }}
              >
                VOTE NOW
              </Link>
            </button>
          </div>
        ) : (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              className="flex justify-center text-center focus:ring-4 focus:ring-red-700 font-medium rounded-full text-2xl px-5 py-2 pt-3 text-white bg-red-700 dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-800 outline outline-red-600 dark:outline-red-700 outline-solid  outline-2 outline-offset-2 dark:focus:ring-red-800 transition-transform duration-150 ease-in-out hover:scale-105"
            >
              <Link
                to="/account/signup"
                className="w-full h-full flex items-center justify-center"
                style={{ fontFamily: "FuturaNowBold" }}
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
