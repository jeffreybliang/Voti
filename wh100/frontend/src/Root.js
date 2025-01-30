import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'

export default function Root () {
  return (
    <>
      <NavBar />
      <main className='flex-shrink-0'>
        <div className='container-fluid py-24'>
          <Outlet />
        </div>
      </main>
    </>
  )
}
