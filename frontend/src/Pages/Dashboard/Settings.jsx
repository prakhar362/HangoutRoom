import React, { useState } from "react";
import Sidebar from '@/components/Sidebar';

const themePreviews = {
  home: [
    { value: "light", label: "Light", bg: "bg-white", border: "border-gray-200", text: "text-black" },
    { value: "dark", label: "Dark", bg: "bg-black", border: "border-gray-300", text: "text-white" },
    { value: "minimal", label: "Minimal", bg: "bg-[#f3f4f6]", border: "border-gray-200", text: "text-black" },
  ],
  character: [
    { value: "classic", label: "Classic", bg: "bg-white", border: "border-gray-200", text: "text-black" },
    { value: "modern", label: "Modern", bg: "bg-[#f3f4f6]", border: "border-gray-200", text: "text-black" },
    { value: "cartoon", label: "Cartoon", bg: "bg-black", border: "border-gray-300", text: "text-white" },
  ]
};

export default function Settings() {
  const [email, setEmail] = useState("jane@example.com");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState({
    home: "light",
    character: "classic"
  });
  const [language, setLanguage] = useState("en");

  return (
    <div className="fixed inset-0 bg-black text-black flex">
      {/* Sidebar */}
      <aside className="relative z-50 h-full w-20 md:w-56 bg-black border-r border-gray-200 flex flex-col items-center py-8 shadow-xl">
        <Sidebar />
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center overflow-y-auto py-10 px-2 md:px-8 bg-[#f3f4f6]">
        <div className="w-full max-w-3xl flex flex-col gap-10">
          {/* Settings Card */}
          <section className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col gap-8">
            <h1 className="text-2xl font-bold mb-2 text-black">Settings</h1>
            {/* Change Email */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-black">Change Email</h2>
              <form className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-[#f3f4f6] text-black focus:outline-none focus:border-black"
                  placeholder="Enter new email"
                />
                <button type="button" className="self-start px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:bg-[#222] transition">Update Email</button>
              </form>
            </div>
            {/* Change Password */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-black">Change Password</h2>
              <form className="flex flex-col gap-3">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-[#f3f4f6] text-black focus:outline-none focus:border-black"
                  placeholder="Enter new password"
                />
                <button type="button" className="self-start px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:bg-[#222] transition">Update Password</button>
              </form>
            </div>
            {/* Language Selection */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-black">Language</h2>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-[#f3f4f6] text-black focus:outline-none focus:border-black w-60"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            {/* Theme Settings with Preview */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-black">Theme Settings</h2>
              <div className="flex flex-col gap-6">
                {/* Home Theme */}
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="font-medium text-black w-32">Home Theme</label>
                    <select
                      value={theme.home}
                      onChange={e => setTheme(t => ({ ...t, home: e.target.value }))}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-[#f3f4f6] text-black focus:outline-none focus:border-black"
                    >
                      {themePreviews.home.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  {/* Preview */}
                  <div className="flex gap-4 mt-2">
                    {themePreviews.home.map(t => (
                      <div
                        key={t.value}
                        className={`w-20 h-14 rounded-xl border ${t.border} flex items-center justify-center ${t.bg} ${theme.home === t.value ? 'ring-2 ring-black' : ''}`}
                      >
                        <span className={`font-semibold ${t.text}`}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Character Theme */}
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="font-medium text-black w-32">Character Theme</label>
                    <select
                      value={theme.character}
                      onChange={e => setTheme(t => ({ ...t, character: e.target.value }))}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-[#f3f4f6] text-black focus:outline-none focus:border-black"
                    >
                      {themePreviews.character.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  {/* Preview */}
                  <div className="flex gap-4 mt-2">
                    {themePreviews.character.map(t => (
                      <div
                        key={t.value}
                        className={`w-20 h-14 rounded-xl border ${t.border} flex items-center justify-center ${t.bg} ${theme.character === t.value ? 'ring-2 ring-black' : ''}`}
                      >
                        <span className={`font-semibold ${t.text}`}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
