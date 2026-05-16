import React, { useEffect } from 'react'
import { MdAttachFile, MdSend } from 'react-icons/md'
import { useState, useRef } from 'react'
import useChatContext from '../context/ChatContext.jsx'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { baseURL } from '../config/AxiosHelper.js'
import { io } from "socket.io-client";
import { fetchMessagesApi } from '../service/RoomService.js'
import { timeAgo } from '../config/helper.js'
import { uploadFileApi } from '../service/FileService';

// TODO : Work on Stomp Client and WebSocket connection. 37:00

const ChatPage = () => {

    const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
    // console.log(roomId, currentUser, connected);

    const navigate = useNavigate();
    useEffect(() => {
        if (!connected) {
            navigate('/');
        }
    }, [roomId, connected, currentUser]);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const socketRef = useRef(null);
    const fileInputRef = useRef(null);


    // Page initial 

    // scroll to bottom when messages change
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    // Load messages from server.
    useEffect(() => {
        async function fetchMessages() {
            // Fetch messages from server
            try {
                const fetchedMessages = await fetchMessagesApi(roomId, 50, 0);
                // console.log("fetch : ",fetchedMessages.content);
                setMessages(fetchedMessages.messages);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        }
        if (connected) {
            fetchMessages();
        }
    }, [connected, roomId]);

    // Stomp Client connection and subscription configuration 
    useEffect(() => {

        if (!connected) return;

        const socket = io(
            import.meta.env.VITE_API_URL
        );

        socketRef.current = socket;

        socket.on("connect", () => {

            console.log("Connected:", socket.id);

            toast.success("Connected");

            // join room
            socket.emit("join-room", roomId);
        });

        // receive messages
        socket.on("receive-message", (message) => {

            console.log("Message received:", message);

            setMessages((prevMessages) => [
                ...prevMessages,
                message,
            ]);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });

        return () => {
            socket.disconnect();
        };

    }, [roomId, connected]);

    // Handle File Upload
    const handleFileUpload = async (e) => {

        try {

            const file = e.target.files[0];

            if (!file) return;

            const uploadedFile = await uploadFileApi(file);

            const isImage = file.type.startsWith("image/");

            const message = {
                roomId,
                sender: currentUser,
                content: isImage
                    ? "Image"
                    : "Document",
                messageType: isImage
                    ? "image"
                    : "file",
                fileUrl: uploadedFile.fileUrl,
                fileName: uploadedFile.fileName,
            };

            socketRef.current.emit(
                "send-message",
                message
            );

        } catch (error) {

            console.log(error);

            toast.error("File upload failed");
        }
    };

    // Send Message
    const sendMessage = () => {

        if (
            socketRef.current &&
            connected &&
            input.trim()
        ) {

            console.log("Sending Message:", input);

            const message = {
                roomId,
                sender: currentUser,
                content: input,
            };

            socketRef.current.emit(
                "send-message",
                message
            );

            setInput("");
        }
    };

    // Leave Room
    const handleLeaveRoom = () => {

        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        toast.success("Left the room successfully!");
        navigate('/');
    }

    return (
        <div className='h-screen flex flex-col bg-[#0B141A] overflow-hidden'>
            {/* Header  */}
            <header className='h-16 px-4 bg-[#202C33] flex items-center justify-between shadow-md flex-shrink-0'>
                <div className="flex flex-col">
                    <h1 className="text-white font-semibold text-base">
                        {roomId}
                    </h1>

                    <p className="text-gray-400 text-xs">
                        {currentUser}
                    </p>
                </div>
                <div>
                    <button onClick={handleLeaveRoom} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm">Leave Room</button>
                </div>
            </header>

            {/* Chat Messages */}
            <main
                ref={chatBoxRef}
                className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-4 bg-[#111B21] w-full max-w-5xl mx-auto"
            >
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`my-1 px-3 py-2 rounded-2xl max-w-[80%] shadow-md ${message.sender === currentUser
                                ? "bg-[#005C4B] text-white"
                                : "bg-[#202C33] text-white"
                                }`}
                        >
                            <div className='flex flex-row gap-2'>
                                <img
                                    className="w-8 h-8 rounded-full object-cover"
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.sender}`}
                                    alt={message.sender} />
                                <div className='flex flex-col gap-1 '>
                                    <p className='text-sm font-bold'>{message.sender}</p>
                                    {/* <p className="break-words text-[15px]">{message.content}</p> */}
                                    {
                                        message.messageType === "image" ? (

                                            <img
                                                src={message.fileUrl}
                                                alt="shared"
                                                className="
                                                    rounded-xl
                                                    mt-2
                                                    w-full
                                                    max-w-[220px]
                                                    max-h-[300px]
                                                    object-cover
                                                    border
                                                    border-gray-600
                                                    "
                                            />

                                        ) : message.messageType === "file" ? (

                                            <a
                                                href={message.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline text-blue-300"
                                            >
                                                {message.fileName}
                                            </a>

                                        ) : (

                                            <p>{message.content}</p>
                                        )
                                    }
                                    <p className='text-xs text-right italic text-gray-400'>{timeAgo(message.timeStamp)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {/* Input Box */}
            <div className="bg-[#202C33] p-2 flex items-center gap-2">

                <>

                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />

                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="text-gray-300 p-2"
                    >
                        <MdAttachFile size={22} />
                    </button>

                </>
                <div className="flex items-center w-full bg-[#2A3942] rounded-full px-2">

                    <input
                        type="text"
                        value={input}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 bg-transparent text-white px-3 py-3 outline-none"
                    />

                    <button
                        onClick={sendMessage}
                        className="bg-[#00A884] hover:bg-[#019875] p-3 rounded-full text-white"
                    >
                        <MdSend size={18} />
                    </button>

                </div>

            </div>
        </div>
    )
}

export default ChatPage