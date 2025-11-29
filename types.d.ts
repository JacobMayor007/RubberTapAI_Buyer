import { Dayjs } from "dayjs";

type Profile = {
  $id: string;
  $createdAt?: string;
  email: string;
  fullName: string;
  fName: string;
  lName: string;
  subscription: Boolean;
  username: string;
  imageURL: string;
  API_KEY: string;
  notif: boolean;
  pushToken: string;
  weatherAlert: boolean;
  messageAlert: boolean;
  marketAlert: boolean;
  rate: number;
};

type MyNotifications = {
  $id: string;
  $createdAt?: Dayjs;
  type: string;
  message: string;
  isRead: boolean;
  userId: string;
  receiverId: string;
  senderProfile: string;
};

type MessageHistory = {
  $id: string;
  $createdAt: Dayjs;
  product_id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  imageUrl: string;
};

type ChatRoom = {
  $id: string;
  $createdAt: Dayjs;
  participants: string[];
  participants_profile: string[];
  participants_username: string[];
  lastMessage: string;
  senderId: string;
  receiverId: string;
};

type Product = {
  $id: string;
  $createdAt: Dayjs;
  address: string;
  user_id: string;
  user_username: string;
  user_email: string;
  productURL: string;
  description: string;
  price: number;
  farmerProfile: string;
  category: string;
  city: string;
  country: string;
  region: string;
};

type AppRate = {
  $id: string;
  rating: number;
  feedback: string;
  userId: string;
  $createdAt: string;
  $updatedAt: string;
};

export { AppRate, ChatRoom, MessageHistory, MyNotifications, Product, Profile };
