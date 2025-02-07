import { useUser } from "./auth";
import { Link } from "react-router-dom";
import InlineCountdownTimer from "./InlineCountdown";
import {deadline} from './Home';

export default function Rules() {
  const user = useUser();

  return (
    <div className="justify-center">
      <div className="justify-center sticky mt-8 w-full">
        <h1 className="text-center bg-white text-red-600">
            <InlineCountdownTimer targetDateTime={deadline} />
        </h1>
      </div>
      <div className="justify-center mt-10 mx-auto px-8 md:w-[50vw] ">
      <div className="text-center text-white">
        <h1 className="text-xl" style={{ fontFamily: "FuturaNowRegular" }}>
          Woroni's Hottest 100 is a poll to find ANU's favourite 100 songs of the year. <br/> Here's how it works.
        </h1>
        <h1 className="text-3xl pt-8" style={{ fontFamily: "AdamCG" }}>
          Voting Rules
        </h1>
        <div
          className="text-lg pt-2 leading-9"
          style={{ fontFamily: "FuturaNowRegular" }}
        >
          <ul className="list-disc list-inside">
            <li className>
              Voting is open until 12:00 PM midday AEDT on Friday 14 March, 2025.
            </li>
            <li>
              Only votes from verified accounts will count towards the final tally.
            </li>
            <li>You can vote for a maximum of 10 songs.</li>
            <li>You cannot vote for the same song more than once.</li>
            <li>
              All votes are worth equal value, regardless of your song order.
            </li>
            <li>
              Votes must be saved to count, and only the most recently saved votes will be counted.
            </li>
          </ul>
        </div>

        <h1 className="text-3xl pt-8" style={{ fontFamily: "AdamCG" }}>
          Song Eligibility
        </h1>
        <div className="text-lg pt-2 leading-9" style={{ fontFamily: "FuturaNowRegular" }}>
        <ul className="list-disc list-inside">
            <li>
            Songs must have been officially released (online or commercially) between 1 December 2023 and 31 December 2024.
            </li>
          </ul>

        </div>
      </div>
    </div>        
    </div>
  );
}
