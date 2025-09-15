import Countdown from "./Countdown";
import { useUser } from "./auth";
import { Link } from "react-router-dom";
import hottest100logo from "./media/hottest100logo.png";
// import hottest100logosolid from './media/hottest100logosolid.png';
// import hottest100logomulti from './media/hottest100logomulti.png';

export const deadline = "2025-09-30T23:59:59+10:00";

export default function Home() {
  const user = useUser();
  const linkPath = user ? "/vote" : "/account/signup";
  const buttonText = user ? "VOTE NOW" : "SIGNUP TO VOTE";
  const leftAlign = user ? "left-[24%] sm:left-[36%]" : "left-[14%] sm:left-[29%]";
  return (
    <div className="flex justify-center w-screen h-screen bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat fixed top-0 left-0 z-40">
      <div className="justify-center">
        <div className="z-100">
          <img
            src={hottest100logo}
            alt="Hottest 100 Logo"
            className="mx-auto mt-32 w-[90%] sm:w-[80%] sm:mt-24"
          />
        </div>

        <div className="relative flex justify-center mt-6 items-center">
          {/* The SVG is now absolutely positioned inside the flex container */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 415.262 415.261"
            className={`absolute w-16 h-16 mr-0 fill-gray-800 dark:fill-white ${leftAlign}`}
            style={{ bottom: "-70%", transform: "translate(-100%, -100%) rotate(270deg) scaleX(-1)" }}
                  >
            {/* SVG content */}
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g>
              <path d="M334.678,145.951c-19.584-38.556-59.364-58.752-99.756-67.32C134.553,57.211,43.365,121.471,0.525,208.375 c-2.448,4.896,4.284,8.567,7.344,4.283C57.441,134.323,132.717,75.571,230.638,92.095 c91.188,15.912,111.996,94.86,112.608,175.643c0,8.568,13.464,8.568,13.464,0C357.322,226.123,353.649,183.283,334.678,145.951z"></path> <path d="M220.846,114.739c-44.676-5.508-88.74,13.464-126.685,35.496c-22.032,12.852-67.32,41.616-64.872,72.215 c0,2.448,3.06,3.061,4.896,1.225c39.78-56.304,107.1-98.532,178.705-96.696c79.561,2.448,89.353,76.5,89.353,140.148 c0,9.18,14.075,9.18,14.075,0C316.317,196.135,303.466,125.143,220.846,114.739z"></path> <path d="M380.578,238.975c-6.12,13.464-25.704,69.156-47.124,66.096c-9.792-1.224-19.584-10.403-26.929-16.523 c-12.852-9.792-25.703-20.196-39.168-29.376c-4.283-3.061-9.18,3.672-5.508,7.344c18.972,17.136,46.512,52.021,74.664,53.856 c29.376,1.224,48.348-54.469,57.528-73.44C398.326,237.751,384.861,230.406,380.578,238.975z"></path> 
              </g>
            </g>
          </svg>


          {/* The Button */}
          <button
            type="button"
            className="flex justify-center text-center focus:ring-4 focus:ring-red-700 font-medium rounded-full text-3xl px-5 py-2 pt-3 text-white bg-red-600 dark:bg-red-700 hover:bg-red-500 dark:hover:bg-red-600 outline outline-red-600 dark:outline-red-700 outline-solid outline-2 outline-offset-2 dark:focus:ring-red-800 transition-transform duration-150 ease-in-out hover:scale-105 tracking-wide"
          >
            <Link
              to={linkPath}
              className="w-full h-full flex items-center justify-center"
              style={{ fontFamily: "FuturaNowBold" }}
            >
              {buttonText}
            </Link>
          </button>
        </div>

        <div className="flex justify-center">
          <div className="bg-white/40 dark:bg-neutral-700/60  rounded-2xl p-1 text-center mt-8">
            <h2
              className="text-3xl/5 text-neutral-700 bg-neutral-200/0 dark:bg-neutral-700/0 rounded-lg text-center p-2 pt-4 sm:p-1 sm:pt-2 sm:pl-3 sm:pr-3 sm:truncate sm:text-3xl sm:tracking-wide mb-1 sm:mb-0 mt-1 sm:mt-0 inline-flex rounded-lg dark:text-white"
              style={{ fontFamily: "FuturaNowBold" }}
            >
              VOTING ENDS IN
            </h2>
            <div className="flex justify-center">
              <Countdown targetDateTime={deadline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
