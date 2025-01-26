import { useUser } from "./auth";
import React, { useState, useEffect } from 'react';
import SongTable from "./SongTable";
import ResultsTable from "./ResultsTable";

export default function Dashboard() {
  const user = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [votes, setVotes] = useState(null);

  const base = process.env.REACT_APP_BACKEND_BASE_URL
  const search_endpoint = process.env.REACT_APP_API_SEARCH

const handleAdd = (song) => {
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
 votes.push(song);
 setVotes([...votes])
};

const handleDelete = (idx) => {
 // idx is the index (zero indexed).
 // remove that index from votes
 votes.splice(idx, 1);
 setVotes([...votes])
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
    const response = await fetch(submitVotesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"), // Include the CSRF token
      },
      body: JSON.stringify({ songs }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit votes: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Votes submitted successfully:", responseData);
  } catch (error) {
    console.error("Error submitting votes:", error);
    setVotes(null); // Reset votes in case of error
  }
};


  const showVotes = async (event) => {
    try {
      const getsongsurl = `http://localhost/api/user-votes/`;
      console.log(getsongsurl)
      const votes = await fetch(getsongsurl);
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
      const response = await fetch(endpoint_url);
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
    <div>
      <h1>Dashboard</h1>
      <p>Welcome user {user.display}!</p>

      <form className="max-w-md mx-auto" onSubmit={handleSearch}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
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
      {results && (
        <ResultsTable songs={results} handleAdd={handleAdd} />
      )}
      {votes && (
        <SongTable songs={votes} handleDelete={handleDelete} />
      )}
      <button onClick = {saveVotes} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Save votes</button>
    </div>
  );
}
