import React from 'react'
import chatIcon from '../assets/chat-icon.png'
import toast from 'react-hot-toast';
import { createRoom, joinRoomApi } from '../service/RoomService';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';

const JoinCreateChate = () => {

    const [details, setDetails] = React.useState({
        userName: "",
        roomId: ""
    });

    const { roomId, setRoomId, currentUser, setCurrentUser, connected, setConnected } = useChatContext();
    const navigate = useNavigate();

    function handleFormInputChange(e) {
        const { name, value } = e.target;
        setDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    }

    function validateForm() {
        // Logic to validate form
        if (details.userName === "" || details.roomId === "") {
            toast.error("Oops! Looks like some details are missing!!");
            return false;
        }
        return true;
    }

    // Join Room
    async function JoinRoom() {

        if (validateForm()) {

            try {

                const room = await joinRoomApi(
                    details.roomId
                );

                toast.success(
                    "Joined room successfully!"
                );

                setRoomId(room.room.roomId);

                setCurrentUser(details.userName);

                setConnected(true);

                navigate("/chat");

            } catch (error) {

                if (error.response?.status === 404) {

                    toast.error("Room not found");

                } else {

                    toast.error(
                        "Failed to join room"
                    );
                }
            }
        }
    }
    // Create Room
    async function CreateRoom() {

        if (validateForm()) {

            try {

                const response = await createRoom(
                    details.roomId
                );

                toast.success(
                    "Room created successfully!"
                );

                setRoomId(
                    response.room.roomId
                );

                setCurrentUser(details.userName);

                setConnected(true);

                navigate("/chat");

            } catch (error) {

                if (error.response?.status === 400) {

                    toast.error(
                        "Room already exists"
                    );

                } else {

                    toast.error(
                        "Failed to create room"
                    );
                }
            }
        }
    }


    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow'>
                <div>
                    <img src={chatIcon} className='w-24 mx-auto' />
                </div>
                <h1 className='text-2xl  font-semibold text-center'>
                    Join Room / Create Room..
                </h1>
                <div className=''>
                    <label htmlFor="name" className='block font-medium mb-2'>
                        Your Name
                    </label>
                    <input
                        onChange={handleFormInputChange}
                        name="userName"
                        value={details.userName}
                        placeholder="Enter your name"
                        type="text"
                        id="userName"
                        className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
                <div className=''>
                    <label htmlFor="roomId" className='block font-medium mb-2'>
                        Room ID / New Room ID
                    </label>
                    <input
                        onChange={handleFormInputChange}
                        name="roomId"
                        value={details.roomId}
                        placeholder="Enter room ID"
                        type="text"
                        id="roomId"
                        className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
                <div className='flex gap-8 justify-center mt-4'>
                    <button
                        onClick={JoinRoom}
                        className='px-3 py-2 bg-blue-500 hover:bg-blue-500 dark:bg-blue-500 hover:dark:bg-blue-800 rounded'>
                        Join Room
                    </button>
                    <button
                        onClick={CreateRoom}
                        className='px-3 py-2 bg-orange-500 hover:bg-orange-500 dark:bg-orange-500 hover:dark:bg-orange-800 rounded'>
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    )
}

export default JoinCreateChate