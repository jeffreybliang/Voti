import { useState } from 'react'
import FormErrors from '../components/FormErrors'
import { requestPasswordReset } from '../lib/allauth'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function RequestPasswordReset () {
  const [email, setEmail] = useState('')
  const [response, setResponse] = useState({ fetching: false, content: null })

  function submit () {
    setResponse({ ...response, fetching: true })
    requestPasswordReset(email).then((content) => {
      setResponse((r) => { return { ...r, content } })
    }).catch((e) => {
      console.error(e)
      window.alert(e)
    }).then(() => {
      setResponse((r) => { return { ...r, fetching: false } })
    })
  }

  return (
   <div className="flex justify-center items-center w-screen h-screen bg-gray-100 overflow-hidden fixed top-0 left-0">
     <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">Reset Password</h1>

      {response.content?.status == 200 ? (
        <p className="text-green-600 text-center">Password reset sent.</p>
      ) : (
        <>
          <p className="text-gray-600 text-center mb-4">
            Remember your password? <Link to='/account/login' className="text-blue-600 hover:underline">Back to login.</Link>
          </p>

          <FormErrors errors={response.content?.errors} />

          <div className="mb-4">
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
            Reset
          </button>
        </>
      )}
    </div>
    </div>
  );
}
