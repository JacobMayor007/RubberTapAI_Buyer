import { LinearGradient } from "expo-linear-gradient";
import { Image, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { cn } from "../utils/cn";
type BackgroundGradientProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function BackgroundGradient({
  children,
  className,
}: BackgroundGradientProps) {
  const { theme } = useTheme();

  return (
    <LinearGradient
      className={cn("flex-1 relative", className)}
      colors={
        theme === "dark" ? ["#202020", "#1B1B1B"] : ["#D9D9D9", "#10B981"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0.33, y: 1 }}
    >
      <Image
        className="absolute z-0 top-0 right-0 opacity-70"
        source={require("@/assets/images/Ellipse34.png")}
      />
      <Image
        className="absolute z-0 top-0 opacity-70"
        source={require("@/assets/images/Ellipse34.png")}
      />

      <View className="flex-1 z-10">{children}</View>
    </LinearGradient>
  );
}
