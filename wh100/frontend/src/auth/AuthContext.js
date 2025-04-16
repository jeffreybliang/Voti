import { useEffect, createContext, useState } from "react";
import { getAuth, getConfig } from "../lib/allauth";
import Spinner from "../Spinner";

export const AuthContext = createContext(null);

function Loading() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 dark:bg-red-800 text-white">
        <h1 className="text-2xl font-semibold mb-4">it's loading hold on pls</h1>
        <div className="flex justify-center mx-auto p-4">
        <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-red-300 motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status">
      <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
      >
        Loading...
      </span>
    </div>
        </div>
      </div>
    </div>
  );
}

function LoadingError() {
  return <div>Loading error!</div>;
}

export function AuthContextProvider(props) {
  const [auth, setAuth] = useState(undefined);
  const [config, setConfig] = useState(undefined);

  useEffect(() => {
    function onAuthChanged(e) {
      setAuth((auth) => {
        if (typeof auth === "undefined") {
          console.log("Authentication status loaded");
        } else {
          console.log("Authentication status updated");
        }
        return e.detail;
      });
    }

    document.addEventListener("allauth.auth.change", onAuthChanged);
    getAuth()
      .then((data) => setAuth(data))
      .catch((e) => {
        console.error(e);
        setAuth(false);
      });
    getConfig()
      .then((data) => {
        setConfig(data);
      })
      .catch((e) => {
        console.error("Error loading config:", e);
      });

    return () => {
      document.removeEventListener("allauth.auth.change", onAuthChanged);
    };
  }, []);
  const loading = typeof auth === "undefined" || config?.status !== 200;
  return (
    <AuthContext.Provider value={{ auth, config }}>
      {loading ? (
        <Loading />
      ) : auth === false ? (
        <LoadingError />
      ) : (
        props.children
      )}
    </AuthContext.Provider>
  );
}
