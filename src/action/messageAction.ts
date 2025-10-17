import { globalFunction } from "../global/fetchWithTimeout";

export const getConversationMessages = async (
  userId: string,
  receiverId: string
) => {
  try {
    const response = await globalFunction.fetchWithTimeout(
      `${process.env.EXPO_PUBLIC_BASE_URL}/messages/${userId}/${receiverId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
      20000
    );

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Failed to fetch messages");

    return data.messages || [];
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return [];
  }
};
