import { useEffect, useState } from 'react'
import { env } from './env'

export default function App() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch(env.VITE_API_URL + '/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
  }, [])

  return (
    <h1 className="flex justify-center p-12">
      <p className="w-1/3 bg-green-600 text-center text-2xl text-white">
        {message ? message : 'Loading...'}
      </p>
    </h1>
  )
}
