import { useState } from "react";

import FormErrors from "../components/FormErrors";
import { login } from "../lib/allauth";
import { Link } from "react-router-dom";
import { useConfig } from "../auth";
import Spinner from "../Spinner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState({ fetching: false, content: null });
  const config = useConfig();

  function submit() {
    setResponse({ ...response, fetching: true });
    login({ username, password })
      .then((content) => {
        setResponse((r) => {
          return { ...r, content };
        });
      })
      .catch((e) => {
        console.error(e);
        window.alert(e);
      })
      .then(() => {
        setResponse((r) => {
          return { ...r, fetching: false };
        });
      });
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat bg-fixed -z-10" />
  
      <div className="flex justify-center items-center w-screen h-screen overflow-hidden fixed top-0 left-0">
        <div className="relative sm:w-full max-w-md bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg border border-gray-200 text-center dark:text-gray-200">
          {response.fetching && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-700/80 flex flex-col items-center justify-center z-10 rounded-2xl">
              <h1 className="text-2xl font-semibold mb-2 text-center text-red-500">
                lol give us a sec
              </h1>
              <div className="p-2">
                <Spinner />
              </div>
            </div>
          )}
  
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className={`${
              response.fetching ? "opacity-40 pointer-events-none" : ""
            }`}
          >
            <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
              Login
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-200 mb-4">
              No account?{" "}
              <Link
                to="/account/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
              >
                Sign up here.
              </Link>
            </p>
            <div className="text-red-700 dark:text-red-400 text-sm mb-2">
              <div className="w-full">
                {response.content?.errors &&
                  response.content.errors.map((err) => (
                    <div key={err.code}>{err.message}</div>
                  ))}
              </div>
            </div>
  
            <div className="space-y-4 text-left dark:text-gray-200">
              <div>
                <label htmlFor="username" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                  Username (uID)
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  required
                  className="w-full px-4 py-2 border dark:bg-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="uXXXXXXX"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full px-4 py-2 border dark:bg-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder=""
                />
                <Link
                  to="/account/password/reset"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
  
            <button
              type="submit"
              disabled={response.fetching}
              className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Login
            </button>
          </form>
  
          {config.data.account.login_by_code_enabled && (
            <Link
              className="block text-center mt-4 text-blue-600 hover:underline dark:text-blue-400"
              to="/account/login/code"
            >
              Mail me a sign-in code
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
