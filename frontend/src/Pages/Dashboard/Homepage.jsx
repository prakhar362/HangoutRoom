import React from 'react'
import Sidebar from '@/components/Sidebar'

function Homepage({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="ml-0 p-6 pt-20">
        {children}
      </main>
      Conent
    </div>
  )
}

export default Homepage