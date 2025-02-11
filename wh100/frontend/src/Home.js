import Countdown from "./Countdown";
import { useUser } from "./auth";
import { Link } from "react-router-dom";
import hottest100logo from './media/hottest100logo.png';
import hottest100logosolid from './media/hottest100logosolid.png';
import hottest100logomulti from './media/hottest100logomulti.png';

export const deadline = "2025-03-14T12:00:00+11:00";

export default function Home() {
  const user = useUser();

  return (
<div className="flex justify-center w-screen h-screen bg-[url('media/best400.png')] bg-[length:100%_100%] bg-no-repeat bg-fixed fixed top-0 left-0">
      <div className="justify-center">

      <div className="z-100">
      <img src={hottest100logo} alt="Hottest 100 Logo" className= "mx-auto w-[75%] mt-24" />
      </div>
      <div className="flex justify-center">
      <h2
        className="text-3xl/5 text-black backdrop-blur-sm bg-white/10 rounded-lg text-center p-1 pt-3 pl-3 pr-4 font-bold sm:truncate sm:text-3xl sm:tracking-tight mb-4 mt-2 inline-flex rounded-lg"
        style={{ fontFamily: "FuturaNowBold" }}
      >
        VOTING ENDS IN
      </h2>

      </div>
        <div className="flex justify-center">
          <Countdown targetDateTime={deadline} />
        </div>

        {user ? (
          <div className="flex justify-center pt-5">
            <button
              type="button"
              className="flex justify-center text-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-blue-800"
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
