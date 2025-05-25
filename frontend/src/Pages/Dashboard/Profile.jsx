import React, { useRef, useState } from "react";
import Sidebar from '@/components/Sidebar';

const mockUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: "https://static.wikitide.net/greatcharacterswiki/thumb/4/4b/Avatar_Generations_-_Aang_Season_3.png/267px-Avatar_Generations_-_Aang_Season_3.png",
  previousAvatars: [
    "/avatars/prev1.png",
    "/avatars/prev2.png",
    "/avatars/prev3.png"
  ],
  groups: [
    { name: "React Devs", themeImg: "/rooms/react.png" },
    { name: "Gamers", themeImg: "/rooms/gamers.png" },
    { name: "Book Club", themeImg: "/rooms/bookclub.png" }
  ]
};

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [newAvatar, setNewAvatar] = useState(null);
  const fileInputRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-black flex">
      {/* Sidebar */}
      <aside className="relative z-50 h-full w-20 md:w-56 bg-black border-r border-gray-200 flex flex-col items-center py-8 shadow-xl">
        <Sidebar />
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center overflow-y-auto py-10 px-2 md:px-8 bg-[#f3f4f6]">
        <div className="w-full max-w-5xl flex flex-col gap-10">
          {/* Profile Card */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
            {/* Avatar Block */}
            <div className="flex flex-col items-center min-w-[180px]">
              <div className="relative group">
                <img
                  src={newAvatar || user.avatar}
                  alt="Avatar"
                  className="w-36 h-36 rounded-full border-4 border-black object-cover shadow-xl bg-[#f3f4f6] group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  className="absolute bottom-2 right-2 bg-white border border-black text-black rounded-full p-2 shadow hover:bg-[#f3f4f6] focus:ring-2 focus:ring-black transition-colors"
                  onClick={() => fileInputRef.current.click()}
                  title="Change Avatar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
                  </svg>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
              <span className="mt-4 text-sm text-black font-medium">Current Avatar</span>
            </div>
            {/* User Info */}
            <div className="flex-1 w-full flex flex-col gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1 md:mb-2 tracking-tight flex items-center gap-2 text-black">
                  {user.name}
                  <span className="inline-block bg-[#f3f4f6] text-black text-xs px-2 py-0.5 rounded-full ml-2 border border-gray-200">User</span>
                </h1>
                <p className="text-gray-600 mb-4 text-base md:text-lg">{user.email}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3 text-black">Joined Groups</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {user.groups.map((group) => (
                    <div
                      key={group.name}
                      className="flex flex-col items-center bg-[#f3f4f6] border border-gray-200 rounded-2xl p-4 shadow hover:shadow-xl transition duration-200 group cursor-pointer hover:border-black"
                    >
                      <img
                        src={group.themeImg}
                        alt={`${group.name} theme`}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-300 mb-2 bg-white"
                      />
                      <span className="text-black font-semibold text-base text-center truncate w-full" title={group.name}>{group.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* Previous Avatars */}
          <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-black">Previous Avatars</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {user.previousAvatars.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt={`Avatar ${idx + 1}`}
                  className="w-16 h-16 rounded-full border border-gray-300 object-cover shadow hover:scale-105 transition-transform cursor-pointer bg-[#f3f4f6]"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
