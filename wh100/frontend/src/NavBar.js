import { useUser, useConfig } from './auth';
import { useLocation, Link } from 'react-router-dom';

function NavBarItem(props) {
  const location = useLocation();
  const isActive =
    (props.href && location.pathname.startsWith(props.href)) ||
    (props.to && location.pathname.startsWith(props.to));
  const cls = isActive
    ? 'text-white bg-gray-800 px-3 py-2 rounded-md text-sm font-medium'
    : 'text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium';

  return (
    <li>
      {props.href ? (
        <a className={cls} href={props.href}>
          {props.icon} {props.name}
        </a>
      ) : (
        <Link className={cls} to={props.to}>
          {props.icon} {props.name}
        </Link>
      )}
    </li>
  );
}

export default function NavBar() {
  const user = useUser();
  const config = useConfig();
  const anonNav = (
    <>
      <NavBarItem to="/account/login" icon="🔑" name="Login" />
      <NavBarItem to="/account/signup" icon="🧑" name="Signup" />
      <NavBarItem to="/account/password/reset" icon="🔓" name="Reset password" />
    </>
  );
  const authNav = (
    <>
      <NavBarItem to="/account/email" icon="📬" name="Change Email" />
      <NavBarItem to="/account/password/change" icon="🔒" name="Change Password" />
      {config.data.usersessions ? (
        <NavBarItem to="/account/sessions" icon="🚀" name="Sessions" />
      ) : null}
      <NavBarItem to="/account/logout" icon="👋" name="Logout" />
    </>
  );

  return (
    <nav className="bg-gray-900 shadow fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-lg">
              Woroni's Hottest 100
            </Link>
          </div>
          <div className="flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="navbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="hidden md:block" id="navbar">
          <ul className="flex space-x-4">
            <NavBarItem to="/dashboard" icon="📈" name="Dashboard" />
            {window.DEVELOPMENT ? (
              <NavBarItem href="http://localhost:1080" icon="✉️" name="MailCatcher" />
            ) : null}
            {user ? authNav : anonNav}
          </ul>
        </div>
      </div>
    </nav>
  );
}
