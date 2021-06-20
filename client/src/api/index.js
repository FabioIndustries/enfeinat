import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
  }

  return req;
});

// General API
export const fetchGeneralNumbers = () => API.get("/general/numbers");

// Users API
export const login = (formData) => API.post("/user/login", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
export const updateUser = (formData) => API.post("/user/updateuser", formData);

// Offers API
export const fetchOffers = () => API.get("/offers");
export const createOffer = (newOffer) => API.post("/offers", newOffer);
export const updateOffer = (id, updatedOffer) => API.patch(`/offers/${id}`, updatedOffer);
export const deleteOffer = (id) => API.delete(`/offers/${id}`);

// Candidates API
export const fetchCandidates = () => API.get("/candidatures");
export const createCandidate = (newCandidate) => API.post("/candidatures", newCandidate);
export const updateCandidate = (id, updatedCandidate) => API.patch(`/candidatures/${id}`, updatedCandidate);
export const deleteCandidate = (id) => API.delete(`/candidatures//${id}`);

// Conversations API
export const fetchConversations = () => API.get("/conversations");
export const createConversation = (newConversation) => API.post("/conversations", newConversation);

// Messages API
export const fetchMessages = (conversationsList) => API.get("/messages", { params: { conversations: conversationsList } });
export const createMessage = (newMessage) => API.post("/messages", newMessage);
export const markMessageAsRead = (messageList) => API.patch("/messages", messageList);
