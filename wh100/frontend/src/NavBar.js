import { useEffect, useState } from "react";
import { useUser, useConfig } from "./auth";
import { useLocation, Link } from "react-router-dom";
import { logout } from "./lib/allauth"; // Import the logout function
import classNames from "classnames";
import * as allauth from "./lib/allauth";

function NavBarItem({ href, to, icon, name, onClick }) {
  const location = useLocation();
  const isActive =
    (href && location.pathname.startsWith(href)) ||
    (to && location.pathname.startsWith(to));

  const cls = isActive
    ? "text-white font-extrabold bg-red-800 h-full w-20 flex items-center justify-center text-sm font-medium"
    : "text-white bg-red-600 h-full w-20 flex items-center justify-center text-sm font-medium hover:bg-red-800";

  const stylFutura = isActive
    ? {
        fontFamily: "FuturaNowBold",
        lineHeight: "normal",
        verticalAlign: "middle",
      }
    : {
        fontFamily: "FuturaNowRegular",
        lineHeight: "normal",
        verticalAlign: "middle",
      };

  return (
    <li>
      {href ? (
        <a className={cls} href={href}>
          {icon} {name}
        </a>
      ) : (
        <Link className={cls} to={to} onClick={onClick}>
          {icon} {name}
        </Link>
      )}
    </li>
  );
}

export default function NavBar() {
  const user = useUser();
  const config = useConfig();
  const [opened, setOpened] = useState(false);
  const ADMIN_USER_ID = process.env.REACT_APP_ADMIN_USER_ID;

  function handleLogout(event) {
    event.preventDefault(); // Prevent navigation
    localStorage.removeItem("userVotes"); // Clear stored emails
    localStorage.removeItem("initialVotes"); // Clear stored emails
    logout()
      .then(() => {
        // window.location.href = '/'; // Redirect to home after logout
      })
      .catch((e) => {
        console.error(e);
        // window.alert("Logout failed");
      });
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

  // In NavBar.js

  const handleCreateHottest100 = async () => {
    try {
      const response = await fetch(
        "https://api.woroni100.com/api/spotify/create-hottest-100/",
        {
          // No port here for API call too
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        // Encode the specific frontend URL for post-auth action,
        // also without a port if your frontend is proxied to localhost directly.
        const frontendRedirectUrl = encodeURIComponent(
          `https://api.woroni100.com/vote?action=create_playlist_after_auth`
        );

        // Redirect the entire browser to start Spotify OAuth
        window.location.href = `https://api.woroni100.com/api/spotify/auth/?next=${frontendRedirectUrl}`; // No port here either
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error creating Hottest 100 playlist:", error);
      alert(`Failed to create playlist: ${error.message}`);
    }
  };

  const handleDownloadHottest100Excel = async () => {
    try {
      const response = await fetch(
        "https://api.woroni100.com/api/spotify/download-hottest-100-excel/",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "hottest_100.xlsx"; // Optional: you can extract the filename from the response headers if needed
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Failed to download spreadsheet: ${error.message}`);
    }
  };

  const anonNav = (
    <>
      <NavBarItem to="/account/login" name="LOGIN" />
      <NavBarItem to="/account/signup" name="SIGNUP" />
    </>
  );

  const authNav = (
    <>
      {config.data.usersessions ? (
        <NavBarItem to="/account/sessions" icon="🚀" name="Sessions" />
      ) : null}
      {/* <NavBarItem to="/" icon="👋" name="Logout" onClick={handleLogout} /> */}
    </>
  );


  const authHamburger = (
    <div className="flex items-center absolute right-3">
      {user && (
        <span className="text-white mr-2 text-xs sm:text-sm">
          {user.display}
        </span>
      )}

      <div
        className={classNames("tham tham-e-squeeze tham-w-6", {
          "tham-active": opened,
        })}
        onClick={() => setOpened(!opened)}
      >
        <div className="tham-box">
          <div className="tham-inner" />
        </div>
      </div>

      {opened && (
        <div
          id="dropdown"
          className="absolute z-50 right-0 top-8 bg-red-100 divide-y divide-gray-100 rounded shadow-sm w-32 dark:bg-red-600 mt-2 font-medium"
        >
          <ul className="text-center text-sm text-gray-700 dark:text-gray-200">
            {user && user.id === process.env.REACT_APP_ADMIN_USER_ID && (
              <>
                <li>
                  <Link
                    to="#" // Using # to prevent navigation
                    onClick={(e) => {
                      e.preventDefault();
                      handleCreateHottest100();
                    }}
                    className="block px-4 py-2 rounded hover:bg-red-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
                  >
                    🎵 CREATE
                  </Link>
                </li>
                <li>
                  <Link
                    to="#" // Using # to prevent navigation
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownloadHottest100Excel();
                    }}
                    className="block px-4 py-2 rounded hover:bg-red-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
                  >
                    📥 EXPORT
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to="/"
                onClick={handleLogout}
                className="block px-4 py-2 rounded hover:bg-red-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
              >
                👋 LOGOUT
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <nav className="bg-red-600 shadow fixed top-0 w-full z-50">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="relative flex items-center bg-red-600 mx-auto justify-center px-40 border-b">
              <Link
                to="/"
                style={{ fontFamily: "FuturaNowBold" }}
                className="relative text-white text-4xl mt-2"
              >
                W
              </Link>
            </h1>
          </div>

          {/* Hamburger Icon */}

          <div
            id="navbar"
            className="relative bg-red-600 flex justify-center items-center"
          >
            <ul className="flex h-8 ">
              <NavBarItem to="/vote" name="VOTE" />
              {window.DEVELOPMENT ? (
                <NavBarItem
                  href="http://localhost:1080"
                  icon="✉️"
                  name="MailCatcher"
                />
              ) : null}
              <NavBarItem to="/rules" name="RULES" />
              {user ? authNav : anonNav}
            </ul>
            {user && authHamburger}
          </div>
        </div>
      </nav>
    </div>
  );
}
