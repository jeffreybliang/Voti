import InlineCountdownTimer from "./InlineCountdown";
import { deadline } from "./Home";
import hottest100logo from "./media/hottest100logo.png";
// import hottest100logosolid from './media/hottest100logosolid.png';
// import hottest100logomulti from './media/hottest100logomulti.png';

export default function Rules() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat bg-fixed -z-10" />

      <div className="overflow-hidden flex flex-col transform translate-y-[68px]">
        <div className="justify-center sticky w-full mt-5">
          <h1 className="text-center bg-white dark:bg-gray-800 text-red-600 border-t border-b border-gray-300">
            <InlineCountdownTimer targetDateTime={deadline} />
          </h1>
        </div>

        <div
          className="mx-auto w-full max-w-5xl min-h-[calc(100vh-114px)] px-4 sm:px-12  flex-1 backdrop-blur-md bg-white/60 dark:bg-gray-900/50"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, var(--fade-color) 10%, var(--fade-color) 90%, transparent)",
          }}
        >
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="z-100">
              <img
                src={hottest100logo}
                alt="Hottest 100 Logo"
                className="mx-auto w-[40%] mt-2 sm:w-[20%] sm:mt-2"
              />
            </div>
          </div>

          <div className="text-center text-black dark:text-gray-100 mt-5 px-8">
            <h1 className="text-xl" style={{ fontFamily: "FuturaNowRegular" }}>
              Woroni's Hottest 100 is a poll to find ANU's favourite 100 songs
              of the year. <br /> Here's how it works.
            </h1>
            <h1
              className="text-2xl pt-8 font-bold"
              style={{ fontFamily: "AdamCG" }}
            >
              Voting Rules
            </h1>
            <div
              className="text-lg pt-2 leading-8"
              style={{ fontFamily: "FuturaNowRegular" }}
            >
              <ul className="list-disc list-inside">
                <li className>
                  Voting is open until 12:00 PM midday AEDT on Friday 14 March,
                  2025.
                </li>
                <li>
                  Only votes from verified accounts will count towards the final
                  tally.
                </li>
                <li>You can vote for a maximum of 10 songs.</li>
                <li>You cannot vote for the same song more than once.</li>
                <li>
                  Each song you vote for receives one equal vote, regardless of
                  the order you list them.
                </li>
                <li>
                  Make sure to save your votes — only your most recently saved selections will count.
                </li>
              </ul>
            </div>

            <h1
              className="text-2xl pt-8 font-bold"
              style={{ fontFamily: "AdamCG" }}
            >
              Song Eligibility
            </h1>
            <div
              className="text-lg pt-2 leading-9 px-1 md:px-16"
              style={{ fontFamily: "FuturaNowRegular" }}
            >
              <ul className="list-disc list-inside">
                <li>
                  Songs must have been officially released (online or
                  commercially) between 1 January 2024 and 30 April 2025.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
