import React, { useState, useEffect, useRef } from 'react';

const Chatbox = ({ socket, roomName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('new-message', (messageData) => {
            setMessages(prevMessages => [...prevMessages, messageData]);
        });

        // Cleanup socket listener on component unmount
        return () => {
            socket.off('new-message');
        };
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket) {
            socket.emit('sendMessage', { roomName, message: newMessage });
            setNewMessage('');
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
                {isOpen ? 'Close Chat' : 'Open Chat'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col mt-2">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Room Chat ({roomName})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {messages.map((msg, index) => (
                            <div key={index} className="text-sm">
                                <span className="font-semibold">{msg.id}:</span> {msg.message}
                            </div>
                        ))}
                         <div ref={messagesEndRef} /> {/* Scroll anchor */}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
                            placeholder="Type your message..."
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 transition-colors"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbox; 