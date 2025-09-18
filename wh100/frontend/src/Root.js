import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import * as allauth from "./lib/allauth";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

export default function Root() {
    
  const location = useLocation();

  useEffect(() => {
    const baseTitle = "Woroni's Hottest 100";
  
    const titles = {
      "/": baseTitle,
      "/vote": "Vote | " + baseTitle,
      "/rules": "Rules | " + baseTitle,
      "/account/login": "Login | " + baseTitle,
      "/account/signup": "Sign Up | " + baseTitle,
      "/account/login/code": "Login Code | " + baseTitle,
      "/account/login/code/confirm": "Confirm Code | " + baseTitle,
      "/account/email": "Change Email | " + baseTitle,
      "/account/logout": "Logout | " + baseTitle,
      "/account/verify-email": "Verify Email | " + baseTitle,
      "/account/password/reset": "Reset Password | " + baseTitle,
      "/account/password/reset/key": "Reset Password | " + baseTitle,
      "/account/password/change": "Change Password | " + baseTitle,
      "/account/reauthenticate": "Reauthenticate | " + baseTitle,
    };
  
    const normalisedPath =
      location.pathname.replace(/\/+$/, "") || "/"; // handle trailing slashes
  
    const matched = Object.keys(titles).find((key) =>
      key.includes("/:") // dynamic route?
        ? normalisedPath.startsWith(key.split("/:")[0])
        : key === normalisedPath
    );
  
    document.title = titles[matched] || baseTitle;
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar      />

      <main className="flex-grow">
        <div className="container-fluid">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
