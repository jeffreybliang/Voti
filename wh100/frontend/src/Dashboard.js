import { useUser } from "./auth";
import React, { useState, useEffect, useCallback, useRef } from "react";
import SongTable from "./SongTable";
import ResultsTable from "./ResultsTable";
import CustomAlert from "./CustomAlert";
import TemporaryAlert from "./TemporaryAlert";
import Spinner from "./Spinner";
import InlineCountdownTimer from "./InlineCountdown";
import "./index.css";

export default function Dashboard() {
  const user = useUser();
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

  const base = process.env.REACT_APP_BACKEND_BASE_URL;
  const search_endpoint = process.env.REACT_APP_API_SEARCH;

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
      console.log("Votes submitted successfully:", responseData);
      setTemporaryMessage("Votes submitted successfully");
      setShowTemporaryAlert(true);
      setAlertKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.log(error);
      setShowSubmitVotesSpinner(false);
      if (
        error.status === 400 &&
        error.data?.error === "You can only select up to 10 songs."
      ) {
        setAlertMessage("You can only select up to 10 songs.");
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
      console.log("Submit Votes Spinner is now visible");
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
        console.error("Error fetching votes:", votesResponse.statusText);
        setVotes([]);
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
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
        console.error("Error fetching search results:", response.statusText);
        setResults(null);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
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
    <div className="justify-center">
      <div className="justify-center sticky mt-8 w-full">
        <h1 className="text-center bg-white text-red-600">
          <InlineCountdownTimer targetDateTime="2025-02-28T00:00:00+11:00" />
        </h1>
      </div>

      {showTemporaryAlert && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50">
          <TemporaryAlert
            message={temporaryMessage}
            duration={5000}
            key={alertKey}
          />
        </div>
      )}

      {showAlert && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50">
          <CustomAlert message={alertMessage} onClose={closeAlert} />
        </div>
      )}

      <div className="mx-auto w-[90vw] md:w-[50vw] lg:w-[50vw] xl:w-[30vw]">
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
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search songs by title, artist, album..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                // When the input regains focus and there are results, show them.
                if (results) setShowResults(true);
              }}
              required
            />
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults(null);
                setShowResults(false);
              }}
              className="text-white absolute end-2.5 bottom-2.5 bg-transparent hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 dark:bg-transparent dark:hover:bg-gray-600 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400 justify-center items-center"
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
  <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none flex justify-center">
  <div ref={resultsRef} className="mx-auto pointer-events-auto max-w-screen-md">
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

        {/* SongTable section */}
        {showSongTableSpinner ? (
          <div className="flex justify-center mx-auto p-4">
            <Spinner />
          </div>
        ) : (
          votes && (
            <div className="p-2 relative z-0">
              <SongTable songs={votes} handleDelete={handleDelete} />
            </div>
          )
        )}
      </div>
      <div className="bottom-0 flex justify-center w-full p-4">
        <button
          onClick={saveVotes}
          type="button"
          className="flex justify-center text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Save votes
        </button>
      </div>
    </div>
  );
}
