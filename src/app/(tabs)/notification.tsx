import { getMyUnreadNotif } from "@/src/action/userAction";
import { AppText } from "@/src/components/AppText";
import { useAuth } from "@/src/contexts/AuthContext";
import { MyNotifications } from "@/types";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const [notifs, setNotifs] = useState<MyNotifications[]>([]);
  const { profile } = useAuth();
  useEffect(() => {
    getMyNotifs(profile?.$id || "", profile?.API_KEY || "");
  }, []);

  const getMyNotifs = async (userId: string, API_KEY: string) => {
    try {
      const response = await getMyUnreadNotif(userId, API_KEY);

      setNotifs(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        {notifs?.map((data, index) => {
          return (
            <TouchableOpacity key={index}>
              <AppText>{data?.$id}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
