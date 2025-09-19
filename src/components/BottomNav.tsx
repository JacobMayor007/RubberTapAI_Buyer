import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { View } from "react-native";
import { AppText } from "./AppText";

type BottomNavProps = {
  title: string;
};

export default function BottomNav({ title }: BottomNavProps) {
  return (
    <View className="bg-[#FFE2B1] z-30 h-20 mx-4 mb-6 flex-row items-center justify-around rounded-3xl">
      <Link href="/(tabs)/menu">
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: 44,
            width: 64,
          }}
        >
          <Feather name="menu" size={title === "menu" ? 26 : 24} />
          <AppText
            color="dark"
            className={`${title === "menu" ? `font-bold` : `font-normal`} text-sm`}
          >
            Menu
          </AppText>
        </View>
      </Link>
      <Link href="/(tabs)">
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: 44,
            width: 64,
          }}
        >
          <Feather
            name="home"
            size={title === "home" ? 26 : 24}
            color={title === "home" ? "#3F1F11" : ""}
          />
          <AppText
            color="dark"
            className={`${title === "home" ? `text-2xl text-[#3F1F11] font-bold ` : `font-normal`} text-sm`}
          >
            Home
          </AppText>
        </View>
      </Link>
      <Link href="/(tabs)/chat">
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: 44,
            width: 64,
          }}
        >
          <Feather name="message-circle" size={24} />
          <AppText
            color="dark"
            className={`${title === "chat" ? `font-bold` : `font-normal`} text-sm`}
          >
            Chat
          </AppText>
        </View>
      </Link>
      <Link href="/(tabs)/notification">
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: 44,
            width: 80,
          }}
        >
          <Ionicons name="notifications-outline" size={24} />
          <AppText
            color="dark"
            className={`${title === "notifications" ? `font-bold` : `font-normal`} text-sm`}
          >
            Notifications
          </AppText>
        </View>
      </Link>
    </View>
  );
}
