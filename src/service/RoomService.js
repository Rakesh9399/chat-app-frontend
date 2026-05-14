import { httpClient } from "../config/AxiosHelper";


// Create Room
export const createRoom = async (roomId) => {

  const response = await httpClient.post(
    "/api/v1/rooms",
    {
      roomId,
    }
  );

  return response.data;
};


// Join Room
export const joinRoomApi = async (roomId) => {

  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}`
  );

  return response.data;
};


// Fetch Messages
export const fetchMessagesApi = async (
  roomId,
  size = 50,
  page = 0
) => {

  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?page=${page}&size=${size}`
  );

  return response.data;
};