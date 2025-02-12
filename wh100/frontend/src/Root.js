import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import * as allauth from './lib/allauth';

export default function Root() {
  const [emailAddresses, setEmailAddresses] = useState(() => {
    // Try to load from localStorage on initial load
    const storedEmailAddresses = localStorage.getItem('emailAddresses');
    return storedEmailAddresses ? JSON.parse(storedEmailAddresses) : [];
  });

  // Fetch email addresses if they are not already set
  useEffect(() => {
    if (emailAddresses.length === 0) {
      allauth
        .getEmailAddresses()
        .then((resp) => {
          if (resp.status === 200) {
            setEmailAddresses(resp.data); // Set in state
            localStorage.setItem('emailAddresses', JSON.stringify(resp.data)); // Save to localStorage
          }
        })
        .catch((error) => {
          console.error('Error fetching email addresses:', error);
        });
    }
  }, [emailAddresses]);

  return (
    <>
      <NavBar emailAddresses={emailAddresses} setEmailAddresses={setEmailAddresses} />
      <main className="flex-shrink-0">
        <div className="container-fluid">
          <Outlet context={{ emailAddresses, setEmailAddresses }} />
        </div>
      </main>
    </>
  );
}
