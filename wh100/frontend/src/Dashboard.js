// import { useUser } from "./auth";
import React, { useState, useEffect, useCallback, useRef } from "react";
import SongTable from "./SongTable";
import ResultsTable from "./ResultsTable";
import CustomAlert from "./CustomAlert";
import TemporaryAlert from "./TemporaryAlert";
import Spinner from "./Spinner";
import InlineCountdownTimer from "./InlineCountdown";
import "./index.css";
import { deadline } from "./Home";
import hottest100logo from './media/hottest100logo.png';
// import hottest100logosolid from './media/hottest100logosolid.png';
// import hottest100logomulti from './media/hottest100logomulti.png';
import { useLocation } from 'react-router-dom'; 

export default function Dashboard() {
  // const user = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [votes, setVotes] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showTemporaryAlert, setShowTemporaryAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [temporaryMessage, setTemporaryMessage] = useState("");
  const [alertKey, setAlertKey] = useState(0);

  // State for individual spinners
  const [showResultsTableSpinner, setShowResultsTableSpinner] = useState(false);
  const [showSongTableSpinner, setShowSongTableSpinner] = useState(false);
  const [showSubmitVotesSpinner, setShowSubmitVotesSpinner] = useState(false);

  // New state to track whether to show the results table
  const [showResults, setShowResults] = useState(false);

  // const base = process.env.REACT_APP_BACKEND_BASE_URL;
  // const search_endpoint = process.env.REACT_APP_API_SEARCH;

  const location = useLocation(); // React Router hook to access URL info
  useEffect(() => {
    // Parse the URL's query parameters
    const params = new URLSearchParams(location.search);
    const action = params.get('action'); // Get the 'action' parameter

    if (action === 'create_playlist_after_auth') {
      // 1. Clear the action parameter from the URL
      // This prevents the action from re-triggering if the user
      // refreshes the page or navigates back to this URL.
      window.history.replaceState({}, document.title, location.pathname);

      // 2. Now, make the API call to create the playlist
      const createPlaylistApiCall = async () => {
        try {
          // This call should now succeed because the Spotify token is in the Django session
          const response = await fetch('http://localhost/api/spotify/create-hottest-100/', {
            method: 'GET',
            credentials: 'include', // Ensure session cookies are sent
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          alert(data.message);
        } catch (error) {
          console.error("Error creating Hottest 100 playlist after authentication:", error);
          alert(`Failed to create playlist: ${error.message}`);
        }
      };

      createPlaylistApiCall(); // Execute the API call
    }
  }, [location]); // The effect re-runs if the 'location' object (URL) changes


  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleAdd = (song) => {
    if (votes.length >= 10) {
      setAlertMessage("You can only vote for a maximum of 10 songs!");
      setShowAlert(true);
      return;
    }
    for (let i = 0; i < votes.length; i++) {
      let curr_vote = votes[i];
      if (curr_vote.song_id === song.song_id) {
        alert("you have already voted for this song");
        return;
      }
    }
    setVotes([...votes, song]);
  };

  const handleDelete = (song) => {
    const newVotes = votes.filter((vote) => vote.song_id !== song.song_id);
    setVotes(newVotes);
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        if (cookie.trim().startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const saveVotes = async () => {

    const now = new Date();
    const deadlineDate = new Date(deadline);
  
    if (now > deadlineDate) {
      setTemporaryMessage("Voting has closed — stay tuned for the results!");
      setShowTemporaryAlert(true);
      return;
    }
    if (!Array.isArray(votes)) {
      setAlertMessage("Please wait for your votes to load!");
      setShowAlert(true);
      return;
    }

    if (votes.length === 0) {
      setAlertMessage("No songs have been voted for yet!");
      setShowAlert(true);
      return;
    }  

    try {
      const submitVotesUrl = `http://localhost/api/submit-votes/`;
      const songs = votes.map((vote) => ({
        song_id: vote.song_id,
        name: vote.name,
        artist_ids: vote.artist_ids,
        release_date: vote.release_date,
        img_url: vote.img_url,
      }));

      setShowSubmitVotesSpinner(true);
      const response = await fetch(submitVotesUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({ songs }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw { status: response.status, data: errorData };
      }

      setShowSubmitVotesSpinner(false);
      const responseData = await response.json();
      // console.log("Votes submitted successfully:", responseData);
      setTemporaryMessage("Votes submitted successfully");
      setShowTemporaryAlert(true);
      setAlertKey((prevKey) => prevKey + 1);
    } catch (error) {
      // console.log(error);
      setShowSubmitVotesSpinner(false);
      if (
        error.status === 400 &&
        error.data?.error === " You can only select up to 10 songs."
      ) {
        setAlertMessage(" You can only select up to 10 songs.");
        setVotes((prevVotes) => prevVotes.slice(0, 10));
      } else {
        setAlertMessage("Error submitting votes.");
        setVotes((prevVotes) =>
          prevVotes.length > 10 ? prevVotes.slice(0, 10) : prevVotes
        );
      }
      setShowAlert(true);
    }
  };

  useEffect(() => {
    if (showSubmitVotesSpinner) {
      // console.log("Submit Votes Spinner is now visible");
    }
  }, [showSubmitVotesSpinner]);

  const showVotes = useCallback(async (event) => {
    try {
      const getsongsurl = `http://localhost/api/user-votes/`;
      setShowSongTableSpinner(true);
      const votesResponse = await fetch(getsongsurl);
      setShowSongTableSpinner(false);
      if (votesResponse.ok) {
        const data = await votesResponse.json();
        setVotes(data.songs);
      } else {
        // console.error("Error fetching votes:", votesResponse.statusText);
        setVotes([]);
      }
    } catch (error) {
      // console.error("Error fetching votes:", error);
      setVotes([]);
      setShowSongTableSpinner(false);
    }
  }, []);

  useEffect(() => {
    showVotes();
  }, [showVotes]);

  // Debounce hook for the query value
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedQuery = useDebounce(query, 500);

  const abortControllerRef = useRef();

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      setShowResults(false); // hide the results table if query is empty
      return;
    }

    try {
      const endpoint_url = `http://localhost/api/search/?query=${encodeURIComponent(
        searchQuery
      )}`;
      setShowResultsTableSpinner(true);

      const response = await fetch(endpoint_url, {
        signal: abortControllerRef.current.signal,
      });

      if (abortControllerRef.current.signal.aborted) {
        setShowResultsTableSpinner(false);
        return;
      }

      setShowResultsTableSpinner(false);

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowResults(true); // show the results table when new results are loaded
      } else {
        // console.error("Error fetching search results:", response.statusText);
        setResults(null);
      }
    } catch (error) {
      // console.error("Error fetching search results:", error);
      setResults(null);
    }
  }, []);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    if (debouncedQuery) {
      setResults(null);
      handleSearch(debouncedQuery);
    } else {
      setResults(null);
      setShowResultsTableSpinner(false);
      setShowResults(false);
    }

    return () => abortControllerRef.current.abort();
  }, [debouncedQuery, handleSearch]);

  // ... inside your Dashboard component

  // Ref for the results container.
  const resultsRef = useRef(null);

  // A ref to always have the current value of showResults.
  const showResultsRef = useRef(showResults);
  useEffect(() => {
    showResultsRef.current = showResults;
  }, [showResults]);

  // Outside click listener added once.
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If results container exists and the click target is not inside it...
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        // ...and if the results are currently shown, then hide them.
        if (showResultsRef.current) {
          setShowResults(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Add a fragment to include both background and content
    <>
      {/* Fixed background layer */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat bg-fixed -z-10" />

      {/* Content container without height restriction */}
      <div className="overflow-hidden flex flex-col transform translate-y-[68px]">
        <div className="flex-shrink-0">
          <div className="justify-center sticky w-full mt-5">
            <h1 className="text-center bg-white dark:bg-gray-800 text-red-600 border-t border-b border-gray-300">
              <InlineCountdownTimer targetDateTime={deadline} />
            </h1>
          </div>
        </div>
        <div
          className="mx-auto w-full max-w-5xl min-h-[calc(100vh-114px)] px-4 sm:px-12  flex-1 backdrop-blur-md bg-white/60 dark:bg-gray-900/50"
          style={{
            WebkitMaskImage:
            "linear-gradient(to right, transparent, var(--fade-color) 10%, var(--fade-color) 90%, transparent)",
          }}
        >
          {/* Rest of your existing content */}

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {showTemporaryAlert && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50">
                <TemporaryAlert
                  message={temporaryMessage}
                  duration={5000}
                  alertId={alertKey}
                />
              </div>
            )}

            {showAlert && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50">
                <CustomAlert message={alertMessage} onClose={closeAlert} />
              </div>
            )}

            <div className="z-100">
              <img
                src={hottest100logo}
                alt="Hottest 100 Logo"
                className="mx-auto w-[40%] mt-2 sm:w-[20%] sm:mt-2"
              />
            </div>

            <div className="justify-center mt-5 text-center dark:text-gray-100">
              <h1
                className="text-center text-2xl font-bold"
                style={{ fontFamily: "AdamCG" }}
              >
                {" "}
                Find your faves! 🔍{" "}
              </h1>
              <p className="text-lg" style={{ fontFamily: "FuturaNowRegular" }}>
                {" "}
                Type in a song, artist, or album to add your top tracks to your votes. 
              </p>
            </div>

            <div className="mx-auto w-[73vw] md:w-[50vw] lg:w-[50vw] xl:w-[30vw] mt-3">
              <form
                className="mx-auto justify-center items-center"
                onSubmit={(e) => e.preventDefault()}
              >
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-3 pr-14 ps-6 text-sm sm:text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search songs by title, artist, album..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                      // When the input regains focus and there are results, show them.
                      if (results) setShowResults(true);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setResults(null);
                      setShowResults(false);
                    }}
                    className="absolute inset-y-2 right-2 flex items-center p-1 mr-2 sm:mr-6 text-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-transparent dark:hover:bg-gray-600 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="w-6 h-6 text-gray-500 dark:text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            <div className="relative">
              {/* Results table overlay */}
              {(showResultsTableSpinner || (results && showResults)) && (
                <div className="absolute top-0 left-0 right-0 z-10 flex justify-center">
                  <div ref={resultsRef} className="mx-auto  max-w-screen-md">
                    <ResultsTable
                      showResultsTableSpinner={showResultsTableSpinner}
                      songs={results}
                      handleAdd={handleAdd}
                      handleDelete={handleDelete}
                      votes={votes}
                    />
                  </div>
                </div>
              )}

              <div className="justify-center pt-8 px-2  text-center dark:text-gray-100">
                <h1
                  className="text-center text-2xl font-bold"  
                  style={{ fontFamily: "AdamCG" }}
                >
                  {" "}
                  Your votes. Your soundtrack. 🎧{" "}
                </h1>
                <p
                  className="text-lg"
                  style={{ fontFamily: "FuturaNowRegular" }}
                >
                  {" "}
                  Vote for up to 10 songs. <br /> Add or remove anytime before
                  the deadline. <br /> Order doesn’t matter—each song you choose gets one equal vote.  <br />  Back your
                  faves and don't forget to save!{" "}
                </p>
                <h2
                  className="pt-5 text-xl"
                  style={{ fontFamily: "FuturaNowBold" }}
                >
                  {" "}
                  YOUR VOTES
                </h2>
              </div>

              {/* SongTable section */}
              {showSongTableSpinner ? (
                <div className="flex justify-center mx-auto p-4">
                  <Spinner />
                </div>
              ) : (
                votes && (
                  <div className="mt-1">
                    <SongTable songs={votes} handleDelete={handleDelete} />
                  </div>
                )
              )}
            </div>
            <div className="bottom-0 flex justify-center w-full mt-4 mb-12">
              <button
                onClick={saveVotes}
                type="button"
                className="flex justify-center text-center text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-lg px-5 py-1 pt-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-blue-800"
                style={{ fontFamily: "FuturaNowBold" }}
              >
                SAVE VOTES
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
