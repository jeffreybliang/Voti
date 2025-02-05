import { useState } from 'react';
import FormErrors from '../components/FormErrors';
import { requestLoginCode } from '../lib/allauth';
import { Navigate } from 'react-router-dom';
import Button from '../components/Button';

export default function RequestLoginCode() {
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState({ fetching: false, content: null });

  function submit() {
    setResponse({ ...response, fetching: true });
    requestLoginCode(email)
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

  if (response.content?.status === 401) {
    return <Navigate to='/account/login/code/confirm' />;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Mail me a sign-in code</h1>
        
        <p className="text-gray-600 mb-4">
          You will receive an email containing a special code for a password-free sign-in.
        </p>
        
        <FormErrors errors={response.content?.errors} />
        
        <div className="mb-4 text-left">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <FormErrors param='email' errors={response.content?.errors} />
        </div>
        
        <button
          disabled={response.fetching}
          onClick={() => submit()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Request Code
        </button>
      </div>
    </div>
  );
}

