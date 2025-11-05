import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { AppText } from "./AppText";

type BottomNavProps = {
  title: string;
};

export default function BottomNav({ title }: BottomNavProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
        backgroundColor: theme === "dark" ? `#202020` : `bg-[#FFECCC]`,
      }}
      className={` z-30 h-20 mx-4 mb-6 flex-row items-center justify-around rounded-3xl`}
    >
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
          <Feather
            name="menu"
            size={title === "menu" ? 26 : 24}
            color={
              theme === "dark"
                ? title === "menu"
                  ? "#E2C282"
                  : "#E8C282"
                : title === "menu"
                  ? "#36740A"
                  : "#333333"
            }
          />
          <AppText
            color={theme === "dark" ? `light` : `dark`}
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
            color={
              theme === "dark"
                ? title === "home"
                  ? "#E2C282"
                  : "#E8C282"
                : title === "home"
                  ? "#36740A"
                  : "#333333"
            }
          />
          <AppText
            color={theme === "dark" ? `light` : `dark`}
            className={`${title === "home" ? `text-2xl font-bold ` : `font-normal`} text-sm`}
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
          <Feather
            name="message-circle"
            size={24}
            color={
              theme === "dark"
                ? title === "chat"
                  ? "#E2C282"
                  : "#E8C282"
                : title === "chat"
                  ? "#36740A"
                  : "#333333"
            }
          />
          <AppText
            color={theme === "dark" ? `light` : `dark`}
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
          <Ionicons
            name="notifications-outline"
            size={24}
            color={
              theme === "dark"
                ? title === "notifications"
                  ? "#E2C282"
                  : "#E8C282"
                : title === "notifications"
                  ? "#36740A"
                  : "#333333"
            }
          />
          <AppText
            color={theme === "dark" ? `light` : `dark`}
            className={`${title === "notifications" ? `font-bold` : `font-normal`} text-sm`}
          >
            Notifications
          </AppText>
        </View>
      </Link>
    </View>
  );
}
