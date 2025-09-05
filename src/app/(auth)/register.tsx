import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import Loading from "@/src/components/LoadingComponent";
import Logo from "@/src/components/Logo";
import { useAuth } from "@/src/contexts/AuthContext";
import { globalFunction } from "@/src/global/fetchWithTimeout";
import { account } from "@/src/lib/appwrite";
import Feather from "@expo/vector-icons/Feather";
import Checkbox from "expo-checkbox";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const router = useRouter();
  const [focusedInput, setFocusedInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    fName: "",
    lName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const auth = useAuth();

  const signUp = async () => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

    if (!userInfo.fName) {
      Alert.alert("Required field", "Please enter your first name");
      return;
    }

    if (!userInfo.lName) {
      Alert.alert("Required field", "Please enter your last name");
      return;
    }

    if (!userInfo.email) {
      Alert.alert("Required field", "Please enter your email");
      return;
    }

    if (!userInfo.userName) {
      Alert.alert("Required field", "Please enter your username");
      return;
    }

    if (!userInfo.password) {
      Alert.alert("Required field", "Please enter password");
      return;
    }

    if (!userInfo.confirmPassword) {
      Alert.alert("Required field", "Please enter confirm password");
      return;
    }

    if (!regex.test(userInfo.password)) {
      Alert.alert(
        "Invalid Password",
        "Your password must have a capital letter, a symbol, and at least 8 characters."
      );
      return;
    }

    if (userInfo.password.length < 9) {
      Alert.alert(
        "Password Invalid",
        "Password must be more than 8 characters!",
        [
          {
            text: "Ok",
            style: "default",
          },
        ]
      );
      return;
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Confirm Password does not match Password."
      );
      return;
    }

    if (!agree) {
      Alert.alert(
        "Terms and Conditions",
        "Please check the terms and conditions."
      );
      return;
    }

    try {
      setLoading(true);
      await auth.register(
        userInfo.email,
        userInfo.confirmPassword,
        `${userInfo.fName} ${userInfo.lName}`
      );

      const session = await account.createEmailPasswordSession({
        email: userInfo.email,
        password: userInfo.confirmPassword,
      });

      if (!session) throw new Error("Failed to create session");

      const data = {
        userId: session?.userId,
        username: userInfo.userName,
        fullName: `${userInfo.fName} ${userInfo.lName}`,
        fName: userInfo.fName,
        lName: userInfo.lName,
        email: userInfo.email,
        imageURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=random`,
        role: "buyer",
        notifSettings: false,
        themeSettings: false,
        subscription: false,
      };

      const response = await globalFunction.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_BASE_URL}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": `${process.env.EXPO_PUBLIC_RUBBERTAPAI_API_KEY}`,
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        },
        20000
      );

      const result = await response.json();

      Alert.alert(result.title, result.message);

      router.dismissAll();
      router.replace("/(tabs)");

      setUserInfo({
        fullName: "",
        fName: "",
        lName: "",
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
      });
      setAgree(false);
    } catch (error) {
      console.error("Error registering user:", error);
      Alert.alert("Register Failed", "Failed to create account");
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
        source={require("@/assets/images/Get Started.png")}
        className="flex-1 bg-black"
      >
        <KeyboardAvoidingView
          style={{
            flexGrow: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
          keyboardVerticalOffset={0}
          behavior="padding"
        >
          <ScrollView contentContainerStyle={{ padding: 24 }}>
            <View className="flex items-center justify-between flex-row">
              <Feather
                onPress={() => router.back()}
                name="arrow-left"
                size={24}
                color="white"
              />
              <Logo className="h-12 w-12" />
            </View>
            <View className="items-center gap-5 my-4">
              <AppText
                className="font-poppins font-bold text-2xl"
                color="light"
              >
                Create an Account
              </AppText>
              <AppText className="text-center" color="light">
                Create an account so you can explore the tapping features.
              </AppText>
            </View>
            <View className="mt-6 flex-col gap-8 ">
              <TextInput
                placeholder="First Name"
                value={userInfo.fName}
                autoCapitalize="words"
                placeholderTextColor={"#CCCCCC"}
                onFocus={() => setFocusedInput("first")}
                onBlur={() => setFocusedInput("")}
                onChangeText={(e) => setUserInfo({ ...userInfo, fName: e })}
                className={`h-14 text-slate-100 rounded-md px-4 ${
                  focusedInput === "first"
                    ? "border-[#10B981] border-[1px] bg-[#10B981]/50"
                    : "border-[#10B981] border-2"
                }`}
              />
              <TextInput
                placeholder="Last Name"
                value={userInfo.lName}
                autoCapitalize="words"
                placeholderTextColor={"#CCCCCC"}
                onFocus={() => setFocusedInput("second")}
                onBlur={() => setFocusedInput("")}
                onChangeText={(e) => setUserInfo({ ...userInfo, lName: e })}
                className={`h-14 text-slate-100 border-2 rounded-md px-4 ${
                  focusedInput === "second"
                    ? "border-[#10B981] border-[1px] bg-[#10B981]/50"
                    : "border-[#10B981] border-[1px]"
                }`}
              />
              <TextInput
                placeholder="Email"
                value={userInfo.email}
                onChangeText={(e) => setUserInfo({ ...userInfo, email: e })}
                autoCapitalize="none"
                onFocus={() => setFocusedInput("third")}
                placeholderTextColor={"#CCCCCC"}
                onBlur={() => setFocusedInput("")}
                className={`h-14 text-slate-100 border-2 rounded-md px-4 ${
                  focusedInput === "third"
                    ? "border-[#10B981] border-[1px] bg-[#10B981]/50"
                    : "border-[#10B981] border-[1px]"
                }`}
              />
              <TextInput
                placeholder="Username"
                value={userInfo.userName}
                placeholderTextColor={"#CCCCCC"}
                onChangeText={(e) => setUserInfo({ ...userInfo, userName: e })}
                onFocus={() => setFocusedInput("fourth")}
                onBlur={() => setFocusedInput("")}
                className={`h-14 text-slate-100 border-2 rounded-md px-4 ${
                  focusedInput === "fourth"
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

              <View className="relative">
                <TextInput
                  value={userInfo.confirmPassword}
                  onChangeText={(e) =>
                    setUserInfo({ ...userInfo, confirmPassword: e })
                  }
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={"#CCCCCC"}
                  placeholder="Confirm Password"
                  onFocus={() => setFocusedInput("sixth")}
                  onBlur={() => setFocusedInput("")}
                  className={`h-14 text-slate-100 border-2 rounded-md px-4 ${
                    focusedInput === "sixth"
                      ? "border-[#10B981] border-[1px] bg-[#10B981]/50"
                      : "border-[#10B981] border-[1px]"
                  }`}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-4"
                >
                  {showConfirmPassword ? (
                    <Feather name="eye" size={20} color={"white"} />
                  ) : (
                    <Feather name="eye-off" size={20} color={"white"} />
                  )}
                </Pressable>
              </View>
            </View>
            <View className="flex-row justify-between mt-8">
              <View className="flex-row gap-2 ">
                <Checkbox
                  value={agree}
                  onValueChange={() => setAgree((prev) => !prev)}
                  className={agree ? "#4630EB" : undefined}
                />
                <AppText className="text-[#a3c461] font-semibold font-poppins">
                  Agree to terms & conditions
                </AppText>
              </View>
              <View className="flex-col items-center gap-2 mb-5">
                <AppText className="font-bold text-[#F3E0C1] text-center">
                  Already have an {"\n"}account?
                </AppText>
                <Link
                  href="/(auth)"
                  className="font-bold underline text-[#F3E0C1]"
                >
                  Sign In
                </Link>
              </View>
            </View>
            <View className="mt-4">
              <Button
                title="Sign Up"
                onPress={signUp}
                className="text-xl font-bold tracking-widest py-1.5"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}
