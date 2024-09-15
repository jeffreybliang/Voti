import { useState } from 'react'
import FormErrors from '../components/FormErrors'
import { signUp } from '../lib/allauth'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function Signup () {
  const [username, setUsername] = useState('')
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

    const email = `${username}@anu.edu.au`
    signUp({ username, email, password: password1 }).then((content) => {
      setResponse((r) => { return { ...r, content } })
    }).catch((e) => {
      console.error(e)
      window.alert(e)
    }).then(() => {
      setResponse((r) => { return { ...r, fetching: false } })
    })
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <p>
        Already have an account? <Link to='/account/login'>Login here.</Link>
      </p>

      <FormErrors errors={response.content?.errors} />

      <div>
        <label>Username <input value={username} onChange={(e) => setUsername(e.target.value)} type='text' required /></label>
        <FormErrors param='username' errors={response.content?.errors} />
      </div>
      <div>
        <label>Password: <input autoComplete='new-password' value={password1} onChange={(e) => setPassword1(e.target.value)} type='password' required /></label>
        <FormErrors param='password' errors={response.content?.errors} />
      </div>
      <div>
        <label>Password (again): <input value={password2} onChange={(e) => setPassword2(e.target.value)} type='password' required /></label>
        <FormErrors param='password2' errors={password2Errors} />
      </div>
      <Button disabled={response.fetching} onClick={() => submit()}>Sign Up</Button>

    </div>
  )
}
