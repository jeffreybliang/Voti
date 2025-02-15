import { useState } from 'react'
import FormErrors from '../components/FormErrors'
import { getPasswordReset, resetPassword } from '../lib/allauth'
import { Navigate, Link, useLoaderData } from 'react-router-dom'
import Button from '../components/Button'

export async function loader ({ params }) {
  const key = params.key
  const resp = await getPasswordReset(key)
  return { key, keyResponse: resp }
}

export default function ResetPassword () {
  const { key, keyResponse } = useLoaderData()

  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [password2Errors, setPassword2Errors] = useState([])

  const [response, setResponse] = useState({ fetching: false, content: null })

  function submit () {
    if (password2 !== password1) {
      setPassword2Errors([{ param: 'password2', message: 'Password does not match.' }])
      return
    }
    setPassword2Errors([])
    setResponse({ ...response, fetching: true })
    resetPassword({ key, password: password1 }).then((resp) => {
      setResponse((r) => { return { ...r, content: resp } })
    }).catch((e) => {
      console.error(e)
      window.alert(e)
    }).then(() => {
      setResponse((r) => { return { ...r, fetching: false } })
    })
  }
  if ([200, 401].includes(response.content?.status)) {
    return <Navigate to='/account/login' />
  }
  let body
  if (keyResponse.status !== 200) {
    body = <FormErrors param='key' errors={keyResponse.errors} />
  } else if (response.content?.error?.detail?.key) {
    body = <FormErrors param='key' errors={response.content?.errors} />
  }
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-[url('media/best400.png')] dark:bg-[url('media/darkbest.png')] bg-[length:100%_100%] bg-no-repeat bg-fixed -z-10" />

        <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-gray-200">Reset Password</h1>

        <div className="space-y-4 text-left dark:text-gray-200">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Password</label>
            <input
              autoComplete="new-password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg dark:text-gray-200 dark:bg-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <FormErrors param="password" errors={response.content?.errors} />
          </div>

          <div>
            <label className="block text-gray-700  dark:text-gray-200 font-medium mb-1">Password (again)</label>
            <input
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg dark:text-gray-200  dark:bg-slate-600  focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <FormErrors param="password2" errors={password2Errors} />
          </div>
        </div>

        <button
          disabled={response.fetching}
          onClick={() => submit()}
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Reset
        </button>
      </div>
    </div>
    </>
  )
}
