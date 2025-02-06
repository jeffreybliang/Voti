import { useState } from 'react'

import FormErrors from '../components/FormErrors'
import { login } from '../lib/allauth'
import { Link } from 'react-router-dom'
import { useConfig } from '../auth'

export default function Login () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [response, setResponse] = useState({ fetching: false, content: null })
  const config = useConfig()

  function submit () {
    setResponse({ ...response, fetching: true })
    login({ username, password }).then((content) => {
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
    <div className="sm:w-full max-w-md p-6 shadow-lg bg-white rounded-2xl">
      <div>
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <p className="text-center text-gray-600 mb-4">
          No account? <Link to='/account/signup' className='text-blue-600 hover:underline'>Sign up here.</Link>
        </p>
        <div className="text-red-500 text-sm mb-2">{response.content?.errors && response.content.errors.map(err => <div key={err}>{err}</div>)}</div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type='text'
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <Link to='/account/password/reset' className='text-sm text-blue-600 hover:underline'>Forgot your password?</Link>
        </div>
        <button
          disabled={response.fetching}
          onClick={() => submit()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg disabled:opacity-50"
        >
          Login
        </button>
        {config.data.account.login_by_code_enabled && (
          <Link
            className='block text-center mt-4 text-blue-600 hover:underline'
            to='/account/login/code'
          >
            Mail me a sign-in code
          </Link>
        )}
      </div>
    </div>
  </div>
  );
}
