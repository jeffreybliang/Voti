import { useState } from "react";
import FormErrors from "../components/FormErrors";
import { signUp } from "../lib/allauth";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  //  const [password2, setPassword2] = useState('');
  const [password2Errors, setPassword2Errors] = useState([]);
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit() {
    //    if (password2 !== password1) {
    //      setPassword2Errors([{ param: 'password2', message: 'Password does not match.' }]);
    //      return;
    //    }
    setPassword2Errors([]);
    setResponse({ ...response, fetching: true });

    const email = `${username}@anu.edu.au`;
    signUp({ username, email, password: password1 })
      .then((content) => {
        setResponse((r) => ({ ...r, content }));
      })
      .catch((e) => {
        console.error(e);
        window.alert(e);
      })
      .then(() => {
        setResponse((r) => ({ ...r, fetching: false }));
      });
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat bg-fixed -z-10" />

      <div className="flex justify-center items-center w-screen h-screen overflow-hidden fixed top-0 left-0">
        <div className="sm:w-full max-w-md bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg border border-gray-200 text-center dark:text-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 dark:text-gray-200">Sign Up</h1>

          <p className="text-gray-600 mb-4 dark:text-gray-200">
            Already have an account?{" "}
            <Link to="/account/login" className="text-blue-600  dark:text-blue-400 hover:underline">
              Login here.
            </Link>
          </p>

          <FormErrors errors={response.content?.errors} />

          <div className="space-y-4 text-left dark:text-gray-200 ">
            <div>
              <label className="block   font-medium mb-1">
                Username (uID)
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                required
                className="w-full px-4 py-2 border dark:bg-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none "
                placeholder="uXXXXXXX"
              />
              <FormErrors param="username" errors={response.content?.errors} />
            </div>

            <div>
              <label className="block dark:text-gray-200 font-medium mb-1">
                Password
              </label>
              <input
                autoComplete="new-password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                type="password"
                required
                className="w-full px-4 py-2 border dark:bg-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <FormErrors param="password" errors={response.content?.errors} />
            </div>
          </div>

          <button
            type="submit"
            disabled={response.fetching}
            onClick={() => submit()}
            className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
