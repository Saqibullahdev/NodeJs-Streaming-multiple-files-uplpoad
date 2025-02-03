import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
const App = () => {
    const [messages, setMessages] = useState([]); // Store the messages as an array
    const [currentMessage, setCurrentMessage] = useState(""); // To store the message being typed out

    useEffect(() => {
        let isMounted = true; // Prevent duplicate runs

        const fetchData = async () => {
            console.log("Fetching data...");

            const response = await fetch('http://localhost:3000');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done || !isMounted) break;

                const newChunk = decoder.decode(value); // Get the chunk data

                // Function to simulate typing effect
                let i = 0;
                const typingInterval = setInterval(() => {
                    setCurrentMessage((prev) => prev + newChunk[i]);
                    i += 1;
                    if (i === newChunk.length) {
                        clearInterval(typingInterval);
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            newChunk // Add the full chunk to the messages
                        ]);
                        setCurrentMessage(""); // Reset current message after finishing typing
                    }
                }, 0); // Adjust the delay to control typing speed
            }
        };

        fetchData();
        return () => { isMounted = false }; // Cleanup to prevent duplicate updates
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Chatbot Conversation</h2>
            <div
                style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    height: '400px',
                    overflowY: 'auto',
                    marginBottom: '20px',
                    backgroundColor: '#f9f9f9',
                }}
            >
                {/* Display each full message as a chat bubble */}
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '10px',
                            marginBottom: '10px',
                            borderRadius: '5px',
                            backgroundColor: '#e0f7fa',
                            wordWrap: 'break-word',
                        }}
                    >
                        {message}
                    </div>
                ))}
                {/* Display the current message that is being typed */}
                <div
                    style={{
                        padding: '10px',
                        marginBottom: '10px',
                        borderRadius: '5px',
                        backgroundColor: '#e0f7fa',
                        wordWrap: 'break-word',
                    }}
                >
                    {currentMessage}
                </div>
            </div>
            <FileUpload />
        </div>
    );
};

export default App;
