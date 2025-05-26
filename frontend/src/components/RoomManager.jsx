import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RoomManager = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('select'); // 'select', 'create', 'join'
    const [formData, setFormData] = useState({
        roomName: '',
        description: '',
        isPrivate: false,
        password: '',
        theme: 'Room',
        characterTheme: 'Character',
        isPermanent: false,
        joinCode: ''
    });
    const [error, setError] = useState('');
    const [userRooms, setUserRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    // Configure axios defaults
    axios.defaults.headers.common['Authorization'] = `Bearer ${getAuthToken()}`;

    // Fetch user's rooms
    useEffect(() => {
        const fetchUserRooms = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/user/rooms', {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                });
                setUserRooms(response.data.rooms);
            } catch (err) {
                console.error('Error fetching rooms:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRooms();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/room/create', formData, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            alert(`Room created successfully! Share this join code with others: ${response.data.joinCode}`);
            navigate(`/room/${formData.roomName}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/room/join', {
                joinCode: formData.joinCode,
                isPermanent: formData.isPermanent
            }, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            navigate(`/room/${response.data.room.groupName}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join room');
        }
    };

    const handleJoinExistingRoom = (roomName) => {
        navigate(`/room/${roomName}`);
    };

    if (mode === 'select') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Hangout Room</h2>
                    
                    {/* Existing Rooms Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Your Rooms</h3>
                        {loading ? (
                            <div className="text-center">Loading rooms...</div>
                        ) : userRooms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {userRooms.map((room) => (
                                    <div
                                        key={room._id}
                                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                                        onClick={() => handleJoinExistingRoom(room.groupName)}
                                    >
                                        <h4 className="font-medium">{room.groupName}</h4>
                                        <p className="text-sm text-gray-600">{room.description}</p>
                                        <div className="mt-2 text-sm text-gray-500">
                                            {room.members.length} members
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">You haven't joined any rooms yet</div>
                        )}
                    </div>

                    {/* Create/Join Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={() => setMode('create')}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Create New Room
                        </button>
                        <button
                            onClick={() => setMode('join')}
                            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Join Existing Room
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {mode === 'create' ? 'Create New Room' : 'Join Room'}
                </h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={mode === 'create' ? handleCreateRoom : handleJoinRoom}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Room Name</label>
                            <input
                                type="text"
                                name="roomName"
                                value={formData.roomName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {mode === 'create' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isPrivate"
                                            checked={formData.isPrivate}
                                            onChange={handleInputChange}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Private Room</span>
                                    </label>
                                </div>

                                {formData.isPrivate && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Room Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Room Theme</label>
                                    <select
                                        name="theme"
                                        value={formData.theme}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="Room">Room</option>
                                        <option value="Gallery">Gallery</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Character Theme</label>
                                    <select
                                        name="characterTheme"
                                        value={formData.characterTheme}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="Character">Character</option>
                                        <option value="OtherCharacter">Other Character</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {mode === 'join' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Join Code</label>
                                <input
                                    type="text"
                                    name="joinCode"
                                    value={formData.joinCode}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter 4-digit join code"
                                    maxLength={4}
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Enter the 4-digit code shared by the room creator
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isPermanent"
                                    checked={formData.isPermanent}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Become a permanent member</span>
                            </label>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setMode('select')}
                                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                {mode === 'create' ? 'Create Room' : 'Join Room'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomManager; 