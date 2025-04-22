import { useState, useEffect } from 'react'
import { AuthChangeRedirector, AnonymousRoute, AuthenticatedRoute } from './auth'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import Dashboard from './Dashboard'
import Login from './account/Login'
import RequestLoginCode from './account/RequestLoginCode'
import ConfirmLoginCode from './account/ConfirmLoginCode'
import Logout from './account/Logout'
import Signup from './account/Signup'
import Home from './Home'
import ChangeEmail from './account/ChangeEmail'
import VerifyEmail, { loader as verifyEmailLoader } from './account/VerifyEmail'
import VerifyEmailByCode from './account/VerifyEmailByCode'
import VerificationEmailSent from './account/VerificationEmailSent'
import RequestPasswordReset from './account/RequestPasswordReset'
import ChangePassword from './account/ChangePassword'
import ResetPassword, { loader as resetPasswordLoader } from './account/ResetPassword'
import Reauthenticate from './account/Reauthenticate'
import Root from './Root'
import { useConfig } from './auth/hooks'
import Rules from './Rules'

function createRouter (config) {
  return createBrowserRouter([
    {
      path: '/',
      element: <AuthChangeRedirector><Root /></AuthChangeRedirector>,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/vote',
          element: <AuthenticatedRoute><Dashboard /></AuthenticatedRoute>
        },
        {
          path: '/rules',
          element: <Rules />
        },
        {
          path: '/account/login',
          element: <AnonymousRoute><Login /></AnonymousRoute>
        },
        {
          path: '/account/login/code',
          element: <AnonymousRoute><RequestLoginCode /></AnonymousRoute>
        },
        {
          path: '/account/login/code/confirm',
          element: <AnonymousRoute><ConfirmLoginCode /></AnonymousRoute>
        },
        {
          path: '/account/email',
          element: <AuthenticatedRoute><ChangeEmail /></AuthenticatedRoute>
        },
        {
          path: '/account/logout',
          element: <Logout />
        },
        {
          path: '/account/signup',
          element: <AnonymousRoute><Signup /></AnonymousRoute>
        },
        {
          path: '/account/verify-email',
          element: config.data.account.email_verification_by_code_enabled ? <VerifyEmailByCode /> : <VerificationEmailSent />
        },
        {
          path: '/account/verify-email/:key',
          element: <VerifyEmail />,
          loader: verifyEmailLoader
        },
        {
          path: '/account/password/reset',
          element: <AnonymousRoute><RequestPasswordReset /></AnonymousRoute>
        },
        {
          path: '/account/password/reset/key/:key',
          element: <AnonymousRoute><ResetPassword /></AnonymousRoute>,
          loader: resetPasswordLoader
        },
        {
          path: '/account/password/change',
          element: <AuthenticatedRoute><ChangePassword /></AuthenticatedRoute>
        },
        {
          path: '/account/reauthenticate',
          element: <AuthenticatedRoute><Reauthenticate /></AuthenticatedRoute>
        },
      ]
    }
  ])
}

export default function Router () {
  // If we create the router globally, the loaders of the routes already trigger
  // even before the <AuthContext/> trigger the initial loading of the auth.
  // state.
  const [router, setRouter] = useState(null)
  const config = useConfig()
  useEffect(() => {
    setRouter(createRouter(config))
  }, [config])
  return router ? <RouterProvider router={router} /> : null
}
