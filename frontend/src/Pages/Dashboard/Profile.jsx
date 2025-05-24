import React from 'react'
import Sidebar from '@/components/Sidebar'
function Profile({children}) {
  return (
    <>
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="ml-0 p-6 pt-20">
        {children}
      </main>
      Profile Page
    </div>
    
    </>
  )
}

export default Profile
