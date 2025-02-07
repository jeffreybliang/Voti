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
  const [emailAddresses, setEmailAddresses] = useState(() => {
    // Try to load from localStorage; otherwise, default to an empty array
    return JSON.parse(localStorage.getItem("emailAddresses")) || [];
  });

  useEffect(() => {
    console.log("User object:", user);
  }, []); // Log user whenever it changes

  useEffect(() => {
    // Only fetch if localStorage does not already have emails
    if (emailAddresses.length === 0) {
      allauth
        .getEmailAddresses()
        .then((resp) => {
          if (resp.status === 200) {
            setEmailAddresses(resp.data);
            localStorage.setItem("emailAddresses", JSON.stringify(resp.data)); // Save to localStorage
          }
        })
        .catch((error) => {
          console.error("Error fetching email addresses:", error);
        });
    }
  }, [emailAddresses]); // Dependency ensures effect runs only if emails are not already set

  function handleLogout(event) {
    event.preventDefault(); // Prevent navigation
    localStorage.removeItem("emailAddresses"); // Clear stored emails
    logout()
      .then(() => {
        // window.location.href = '/'; // Redirect to home after logout
      })
      .catch((e) => {
        console.error(e);
        window.alert("Logout failed");
      });
  }

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

  const anonHamburger = <></>;

  const authHamburger = (
    <div className="flex items-center absolute right-3">
      {user && <span className="text-white mr-2 text-xs sm:text-sm">{user.display}</span>}

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
          className="absolute z-50 right-0 top-8 bg-red-100 divide-y divide-gray-100 rounded-lg shadow-sm w-28 dark:bg-gray-700 mt-2"
        >
          <ul className="py-2 text-center text-sm text-gray-700 dark:text-gray-200">
            <li>
              <Link
                to="/"
                onClick={handleLogout}
                className="block px-4 py-2 hover:bg-red-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
              >
                👋 Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <nav className="bg-white shadow fixed top-0 w-full z-50">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between h-16">
            <h1 className="relative flex items-center bg-white w-screen text-center justify-center">
              <Link
                to="/"
                style={{ fontFamily: "FuturaNowBold" }}
                className="relative text-red-600 font-bold text-5xl text-center pt-8"
              >
                W
                <h1
                  style={{ fontFamily: "FuturaNowRegular" }}
                  className="relative text-black text-lg whitespace-nowrap tracking-widest"
                >
                  HOTTEST 100
                </h1>
              </Link>
            </h1>
          </div>

          {/* Hamburger Icon */}

          <div
            id="navbar"
            className="relative bg-red-600 flex justify-center items-center mt-6"
          >
            <ul className="flex h-10 ">
              <NavBarItem to="/dashboard" name="VOTE" />
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
      <div className="justify-center">
        {emailAddresses.length > 0 && (
          <div className="fixed top-40 left-1/2 transform -translate-x-1/2 z-50 mx-auto text-sm sm:text-base w-[66vw] md:w-[42vw] lg:w-[35vw] xl:w-[28vw]">
            {emailAddresses.map(
              (emailObj, index) =>
                !emailObj.verified && (
                  <div
                    class="bg-red-100/90 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md"
                    role="alert"
                  >
                    <div class="flex">
                      <div class="py-1">
                        <svg
                          class="fill-current h-6 w-6 text-red-500 mr-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          transform="scale(1,-1)"
                        >
                          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold text-sm">Only votes from verified accounts count!</p>
                        <p class="text-sm">Check your ANU email for the verification link to vote.
                        </p>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
