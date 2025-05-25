import React, { useState, useEffect } from "react";
import Sidebar from '@/components/Sidebar';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [settings, setSettings] = useState({
    email: "",
    password: "",
    themeSettings: {
      homeTheme: "light",
      characterTheme: "classic",
      accentColor: "#000000",
      darkMode: false
    },
    characterSettings: {
      model: "default-character.glb",
      animations: ["idle", "walk", "run"],
      customizations: {}
    },
    language: "en"
  });

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.user) {
        setSettings({
          email: response.data.user.email,
          password: "",
          themeSettings: response.data.user.themeSettings || settings.themeSettings,
          characterSettings: response.data.user.characterSettings || settings.characterSettings,
          language: response.data.user.language || "en"
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (updates) => {
    try {
      setError(null);
      setSuccess(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:3000/api/v1/user/settings', updates, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess(response.data.message);
      if (response.data.user) {
        setSettings(prev => ({
          ...prev,
          ...response.data.user
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (settings.email) {
      await handleUpdateSettings({ email: settings.email });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (settings.password) {
      await handleUpdateSettings({ password: settings.password });
      setSettings(prev => ({ ...prev, password: "" }));
    }
  };

  const handleThemeUpdate = async (type, value) => {
    const updates = {
      themeSettings: {
        ...settings.themeSettings,
        [type]: value
      }
    };
    await handleUpdateSettings(updates);
  };

  const handleLanguageUpdate = async (e) => {
    const newLanguage = e.target.value;
    await handleUpdateSettings({ language: newLanguage });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black text-black flex">
        <aside className="relative z-50 h-full w-20 md:w-56 bg-black border-r border-gray-200 flex flex-col items-center py-8 shadow-xl">
          <Sidebar />
        </aside>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading settings...</div>
        </main>
      </div>
    );
  }

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
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Change Email */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-black">Change Email</h2>
              <form onSubmit={handleEmailUpdate} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={settings.email}
                  onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-[#f3f4f6] text-black focus:outline-none focus:border-black"
                  placeholder="Enter new email"
                />
                <button type="submit" className="self-start px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:bg-[#222] transition">
                  Update Email
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-black">Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-3">
                <input
                  type="password"
                  value={settings.password}
                  onChange={e => setSettings(prev => ({ ...prev, password: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-[#f3f4f6] text-black focus:outline-none focus:border-black"
                  placeholder="Enter new password"
                />
                <button type="submit" className="self-start px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:bg-[#222] transition">
                  Update Password
                </button>
              </form>
            </div>

            {/* Language Selection */}
            <div>
              <h2 className="text-lg font-semibold mb-2 text-black">Language</h2>
              <select
                value={settings.language}
                onChange={handleLanguageUpdate}
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
                      value={settings.themeSettings.homeTheme}
                      onChange={e => handleThemeUpdate('homeTheme', e.target.value)}
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
                        className={`w-20 h-14 rounded-xl border ${t.border} flex items-center justify-center ${t.bg} ${settings.themeSettings.homeTheme === t.value ? 'ring-2 ring-black' : ''}`}
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
                      value={settings.themeSettings.characterTheme}
                      onChange={e => handleThemeUpdate('characterTheme', e.target.value)}
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
                        className={`w-20 h-14 rounded-xl border ${t.border} flex items-center justify-center ${t.bg} ${settings.themeSettings.characterTheme === t.value ? 'ring-2 ring-black' : ''}`}
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
