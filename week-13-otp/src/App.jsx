import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OtpInput from './components/OtpInput'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex justify-center m-8'>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <OtpInput number = {6}/>
      <div className="card">
        <button className='bg-gray-300 text-gray-800 px-4 py-1'>
          Submit
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
