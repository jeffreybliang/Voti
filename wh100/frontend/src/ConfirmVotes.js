import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Spinner from './Spinner'; // Assuming you have a Spinner component

export default function ConfirmVotes() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) return;

    const confirmVote = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing token.');
        return;
      }

      try {
        const confirmUrl = `/api/confirm-votes/?token=${token}`;
        const response = await fetch(confirmUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Your vote has been successfully confirmed!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to confirm your vote. The token may be invalid or expired.');
        }
      } catch (error) { 
        setStatus('error');
        setMessage('An error occurred. Please try again later.');
      }
    };

    confirmVote();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Confirming your vote...
            </h1>
            <Spinner />
          </div>
        );
      case 'success':
        return (
          <>
            <h1 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-4">
              Vote Confirmed! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
          </>
        );
      case 'error':
        return (
          <>
            <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
              Error
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat -z-10" />

      <div className="flex justify-center items-center w-screen h-screen overflow-hidden fixed top-0 left-0">
        <div className="max-w-md w-full bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
          {renderContent()}
        </div>
      </div>
    </>
  );
}