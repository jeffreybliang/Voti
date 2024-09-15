import { useUser } from "./auth";
import React, { useState } from 'react';

export default function Dashboard() {
  const user = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const base = process.env.REACT_APP_BACKEND_BASE_URL
  const search_endpoint = process.env.REACT_APP_API_SEARCH

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
        <pre className="max-w-md mx-auto mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
}
