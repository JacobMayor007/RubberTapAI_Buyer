import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { AppText } from "./AppText";
import Logo from "./Logo";

type HeaderNavProps = {
  arrow?: boolean;
  title: string;
};

export default function HeaderNav({ arrow, title }: HeaderNavProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row gap-4 items-center">
        {arrow && (
          <Feather
            onPress={() => router.back()}
            name="arrow-left"
            size={28}
            color={theme === "dark" ? `white` : `"#442111"`}
          />
        )}
        <AppText
          color={theme === "dark" ? `light` : `dark`}
          className="font-bold text-2xl"
        >
          {title}
        </AppText>
      </View>
      <Logo className="h-14 w-14" />
    </View>
  );
}
