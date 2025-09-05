import { useRouter } from "expo-router";
import { Image, ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";

export default function NewUser() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={require("@/assets/images/Get Started.png")}
        className="flex-1 bg-black py-7 px-4 justify-between"
      >
        <View>
          <View className="items-end p-4">
            <Image
              className="h-10 w-10"
              source={require("@/assets/images/Logo.png")}
            />
          </View>
          <View className="mt-20">
            <AppText
              color="light"
              className="font-poppins font-bold text-3xl pl-5 pr-20"
            >
              The best app for making your tapping efficient.
            </AppText>
            <AppText
              color="light"
              className="font-poppins text-xl pl-5 pr-20 font-extrabold tracking-widest"
            >
              --------------------------
            </AppText>
          </View>
        </View>
        <View className="mb-10 items-center gap-5">
          <Button
            title="Get Started"
            className="py-1.5 w-full text-center text-lg font-bold"
            onPress={() => router.push("/(auth)/register")}
          />
          <Text
            onPress={() => router.push("/(auth)")}
            className="text-white font-bold font-poppins underline"
          >
            Sign In
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
