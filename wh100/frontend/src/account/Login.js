import { useState } from 'react'
import FormErrors from '../components/FormErrors'
import { login } from '../lib/allauth'
import { Link } from 'react-router-dom'
import { useConfig } from '../auth'
import Button from '../components/Button'

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
    <div>
      <h1>Login</h1>
      <p>
        No account? <Link to='/account/signup'>Sign up here.</Link>
      </p>

      <FormErrors errors={response.content?.errors} />

      <div>
        <label>Username <input value={username} onChange={(e) => setUsername(e.target.value)} type='text' required /></label>
        <FormErrors param='username' errors={response.content?.errors} />
      </div>
      <div><label>Password: <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' required /></label>
        <Link to='/account/password/reset'>Forgot your password?</Link>
        <FormErrors param='password' errors={response.content?.errors} />
      </div>
      <Button disabled={response.fetching} onClick={() => submit()}>Login</Button>
      {config.data.account.login_by_code_enabled
        ? <Link className='btn btn-secondary' to='/account/login/code'>Mail me a sign-in code</Link>
        : null}
    </div>
  )
}
