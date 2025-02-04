import Countdown from './Countdown'
export default function Home () {
  return (
    <div className = "justify-center items-center">
      <h2 className="text-2xl/7 text-center p-4 font-bold sm:truncate sm:text-6xl sm:tracking-tight">Voting ends in</h2>
      <div className = "flex justify-center items-center">
        <Countdown targetDateTime="2025-02-28T00:00:00+11:00" />
      </div>
    </div>
  )
}
