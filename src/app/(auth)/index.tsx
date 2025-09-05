import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import ForgotPassword from "@/src/components/ForgotPassword";
import Loading from "@/src/components/LoadingComponent";
import Logo from "@/src/components/Logo";
import { useAuth } from "@/src/contexts/AuthContext";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const signIn = async () => {
    if (!userInfo.email) {
      Alert.alert("Required field", "Please enter your email");
      return;
    }

    if (!userInfo.password) {
      Alert.alert("Required field", "Please enter password");
      return;
    }

    if (userInfo.password.length < 9) {
      Alert.alert("Please input more than 8 characters");
    }

    try {
      await auth.login(userInfo.email, userInfo.password);
    } catch (error) {
      console.error("Error registering user:", error);

      Alert.alert(
        "Invalid credentials",
        "Please check the email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <ImageBackground
          source={require("@/assets/images/Get Started.png")}
          className="flex-1 bg-black/95 items-center justify-center"
        >
          <Loading className="h-24 w-24" />
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 ">
      <ImageBackground
        source={require("@/assets/images/RubberFarmImage.png")}
        className="flex-1 bg-black/95"
        fadeDuration={0}
      >
        <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={0}>
          <ScrollView>
            <View className="py-6 px-2">
              <MaterialIcons
                name="keyboard-arrow-left"
                size={40}
                onPress={() => router.replace("/getStarted")}
                color="white"
              />
              <View className="flex-col items-center justify-center pt-14 ">
                <Logo className="h-24 w-24" />
                <View className="flex-col ">
                  <Image
                    source={require("@/assets/images/RubberTapText.png")}
                    className="h-16 w-56"
                  />
                  <AppText className="text-right text-[#75A90A] font-medium text-xl font-poppins">
                    AI
                  </AppText>
                </View>
                <View className="w-full gap-4 px-10">
                  <AppText className="font-poppins font-extrabold text-center text-[#F3E0C1] text-xl mb-2">
                    Welcome!
                  </AppText>
                  <TextInput
                    placeholder="Email"
                    value={userInfo.email}
                    onChangeText={(e) => setUserInfo({ ...userInfo, email: e })}
                    onFocus={() => setFocusedInput("third")}
                    placeholderTextColor={"#CCCCCC"}
                    onBlur={() => setFocusedInput("")}
                    className={`h-14 text-slate-100 border-2 rounded-md px-4 ${
                      focusedInput === "third"
                        ? "border-[#10B981] border-[1px] bg-[#10B981]/50"
                        : "border-[#10B981] border-[1px]"
                    }`}
                  />
                  <View className="relative">
                    <TextInput
                      value={userInfo.password}
                      placeholderTextColor={"#CCCCCC"}
                      onChangeText={(e) =>
                        setUserInfo({ ...userInfo, password: e })
                      }
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedInput("fifth")}
                      onBlur={() => setFocusedInput("")}
                      className={`h-14 text-slate-100 border-2 rounded-md px-4 ${
                        focusedInput === "fifth"
                          ? "border-[#10B981] border-[1px] bg-[#10B981]/50"
                          : "border-[#10B981] border-[1px]"
                      }`}
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-4"
                    >
                      {showPassword ? (
                        <Feather name="eye" size={20} color={"white"} />
                      ) : (
                        <Feather name="eye-off" size={20} color={"white"} />
                      )}
                    </Pressable>
                  </View>

                  <TouchableOpacity onPress={() => setForgotModal(true)}>
                    <AppText className="font-poppins font-bold text-[#F3E0C1] text-right">
                      Forgot Password?
                    </AppText>
                  </TouchableOpacity>

                  <Button
                    title="Login"
                    onPress={signIn}
                    className="rounded-full font-bold font-poppins text-lg py-1"
                  />
                </View>
              </View>

              <View className="flex-row justify-center mt-5 gap-2">
                <AppText className="text-[#F3E0C1]">
                  Don't have an account?
                </AppText>
                <AppText
                  className="text-[#F3E0C1] underline font-bold "
                  onPress={() => router.push("/(auth)/register")}
                >
                  Sign up
                </AppText>
              </View>
            </View>
          </ScrollView>
          <Modal visible={forgotModal} animationType="slide">
            <ForgotPassword setForgotModal={setForgotModal} />
          </Modal>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}
