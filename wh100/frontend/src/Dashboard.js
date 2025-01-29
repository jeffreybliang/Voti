import { useUser } from "./auth";
import React, { useState, useEffect } from 'react';
import SongTable from "./SongTable";
import ResultsTable from "./ResultsTable";
import CustomAlert from "./CustomAlert";
import TemporaryAlert from "./TemporaryAlert";
import Spinner from "./Spinner";

export default function Dashboard() {
  const user = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [votes, setVotes] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [temporaryMessage, setTemporaryMessage] = useState('');
  const [showTemporaryAlert, setShowTemporaryAlert] = useState('');
  const [alertKey, setAlertKey] = useState(0); // Key to force re-render the alert

  const base = process.env.REACT_APP_BACKEND_BASE_URL
  const search_endpoint = process.env.REACT_APP_API_SEARCH

const closeAlert = () => {
  setShowAlert(false);
};

const handleAdd = (song) => {
 if (votes.length >= 10) {
    setAlertMessage("You can only vote for a maximum of 10 songs!");
    setShowAlert(true);
    return;
 }
 // idx is the index (zero indexed).
 // remove that index from votes
 // loop through all the current votes array and check that it isn't there
 for (let i = 0; i < votes.length; i++) {
   let curr_vote = votes[i]
   if (curr_vote.song_id === song.song_id) {
     // we have already voted for this song!
     alert("you have already voted for this song")
     return
   }
 }
 setVotes([...votes, song])
};
const handleDelete = (song) => {
  // Remove the song from votes
  const newVotes = votes.filter(vote => vote.song_id !== song.song_id);
  setVotes(newVotes);
};


// function returns component that displays the results
function displayResults(results) {

 return 

}


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

const saveVotes = async () => { // update user's votes in database using the `votes` array
 try {
    const submitVotesUrl = `http://localhost/api/submit-votes/`;

    // Construct the payload expected by the backend
    const songs = votes.map(vote => ({
      song_id: vote.song_id, // Assuming results have song_id
      name: vote.name,
      artist_ids: vote.artist_ids,
      release_date: vote.release_date,
      img_url: vote.img_url,
    }));

    // Send the data to the backend
    setShowSpinner(true)
    const response = await fetch(submitVotesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"), // Include the CSRF token
      },
      body: JSON.stringify({ songs }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response body
      throw { status: response.status, data: errorData }; // Throw an object with error details
    }
   setShowSpinner(false);
  
    const responseData = await response.json();
    console.log("Votes submitted successfully:", responseData);
    setTemporaryMessage("Votes submitted successfully");
    setShowTemporaryAlert(true);
    setAlertKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.log(error)
      if (
        error.status === 400 &&
        error.data?.error === "You can only select up to 10 songs."
        ) {
        setAlertMessage("You can only select up to 10 songs.");
        setVotes((prevVotes) => prevVotes.slice(0, 10)); // Set to the first 10 entries
      } else {
        setAlertMessage("Error submitting votes.");
        setVotes((prevVotes) => prevVotes.length > 10 ? prevVotes.slice(0, 10) : prevVotes); // Clamp to 10 if needed
      }
    
      setShowAlert(true);
    }
    };

  useEffect(() => {
    if (showSpinner) {
      console.log('Spinner is now visible:', showSpinner);
    }
  }, [showSpinner]); // This effect runs whenever `showSpinner` changes

  const showVotes = async (event) => {
    try {
      const getsongsurl = `http://localhost/api/user-votes/`;
      console.log(getsongsurl)
      setShowSpinner(true);
      console.log("showSpinner: " + showSpinner);
      const votes = await fetch(getsongsurl);
      setShowSpinner(false);
      if (votes.ok) {
        const data = await votes.json();
        setVotes(data.songs);
      } else {
        console.error('Error fetching search results:', votes.statusText);
        setVotes(null);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setVotes(null);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const params = new URLSearchParams({ query: query });
      const endpoint_url = `http://localhost/api/search/?query=${encodeURIComponent(query)}`;
      console.log(endpoint_url)
      setShowSpinner(true)
      const response = await fetch(endpoint_url);
      setShowSpinner(false)
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Error fetching search results:', response.statusText);
        setResults(null);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults(null);
    }
  };

  useEffect(() => {
    showVotes();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  return (
    <div className="justify-center">
      <div className = "relative justify-center text-center">
        <h1>Dashboard</h1>
        <p>Welcome user {user.display}!</p>
      </div>
      {/* TemporaryAlert */}
      {showTemporaryAlert && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-10">
            <TemporaryAlert message={temporaryMessage} duration={5000} key={alertKey} />
          </div>
        )}

        {/* CustomAlert */}
        {showAlert && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-10">
            <CustomAlert message={alertMessage} onClose={closeAlert} />
          </div>
        )}
        <form className="max-w-md mx-auto justify-center items-center" onSubmit={handleSearch}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white "
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search songs by title, artist, album..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
      {/* Render search results */}
      {showSpinner && <div className = "flex justify-center mx-auto p-4" ><Spinner /></div>}
      {results && (
        <div className="mx-auto justify-center items-center h-full">
          <ResultsTable 
            songs={results} 
            handleAdd={handleAdd} 
            handleDelete={handleDelete} 
            votes={votes}
            />
        </div>
      )}
      {(votes && (
        <div>
          <SongTable songs={votes} handleDelete={handleDelete} />
        </div>
      ))}
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
