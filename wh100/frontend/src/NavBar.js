import { useState } from "react";
import { useUser, useConfig } from "./auth";
import { useLocation, Link } from "react-router-dom";
import { logout } from "./lib/allauth"; // Import the logout function
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import classNames from "classnames";

function NavBarItem({ href, to, icon, name, onClick }) {
  const location = useLocation();
  const isActive =
    (href && location.pathname.startsWith(href)) ||
    (to && location.pathname.startsWith(to));

  const cls = isActive
    ? "text-white font-extrabold bg-red-800 h-full w-20 flex items-center justify-center text-sm font-medium"
    : "text-white bg-red-600 h-full w-20 flex items-center justify-center text-sm font-medium";

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

  function handleLogout(event) {
    event.preventDefault(); // Prevent navigation
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

  const anonHamburger = (
  <>
  </>
  );
  
  const authHamburger = (    
    <div className="flex items-center absolute right-3">
      <span className="text-white mr-3">{user.display}</span> 
  
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
    <nav className="bg-white shadow fixed top-0 w-full z-10">
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
            {user ? authNav : anonNav}
          </ul>
          {user && authHamburger}
        </div>
      </div>
    </nav>
  );
}
