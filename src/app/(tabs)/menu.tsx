import { rateRubberTapAI } from "@/src/action/userAction";
import AppearanceSettings from "@/src/components/AppearanceSettings";
import { AppText } from "@/src/components/AppText";
import BackgroundGradient from "@/src/components/BackgroundGradient";
import BottomNav from "@/src/components/BottomNav";
import ConfirmCancelModal from "@/src/components/ConfirmOrCancelModal";
import EditProfile from "@/src/components/EditProfile";
import HeaderNav from "@/src/components/HeaderNav";
import HelpAndSupport from "@/src/components/HelpAndSupport";
import Logout from "@/src/components/Logout";
import NotificationSettings from "@/src/components/NotificationSettings";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import { globalFunction } from "@/src/global/fetchWithTimeout";
import { AppRate } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Menu() {
  const { profile, user } = useAuth();
  const { theme } = useTheme();
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalShown, setModalShown] = useState("");
  const [rate, setRate] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [userRated, setUserRated] = useState<AppRate | null>(null);

  useEffect(() => {
    const isUserRate = async () => {
      try {
        const response = await globalFunction.fetchWithTimeout(
          `${process.env.EXPO_PUBLIC_BASE_URL}/rubbertapai/${profile?.$id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
          25000
        );

        const data = await response.json();
        setUserRated(data);
      } catch (error) {
        console.error(error);
      }
    };
    isUserRate();
  }, [profile]);

  const fetchUserRatingStatus = async () => {
    try {
      const response = await globalFunction.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_BASE_URL}/rubbertapai/${profile?.$id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
        25000
      );

      const data = await response.json();
      setUserRated(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRateApp = async (
    userId: string,
    rating: number,
    feedback: string,
    API_KEY: string
  ) => {
    try {
      if (!rating || !feedback.trim()) {
        Alert.alert(
          "Missing Information",
          "Please provide both a rating and written feedback before submitting."
        );
        return;
      }

      await rateRubberTapAI(userId, rating, feedback, API_KEY);

      Alert.alert(
        "Your feedback has submitted",
        "Thank you for your valuable feedback. We’ll use it to improve the experience.",
        [
          {
            style: "default",
            text: "Ok",
            onPress: async () => {
              await fetchUserRatingStatus();
            },
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Something went wrong on our end. Can you please try again? Thank you!"
      );
    } finally {
      setVisibleModal(false);
      setModalShown("");
    }
  };

 

  return (
    <SafeAreaView className="flex-1">
      <BackgroundGradient className={`flex-1 `}>
        <View className={` z-20 gap-4 p-6`}>
          <HeaderNav arrow={true} title="" />
          <LinearGradient
            colors={
              theme === "dark" ? ["#03865a", "#101010"] : ["#FFFFFF", "#10B981"]
            }
            style={{ borderRadius: 10, padding: 16 }}
            className="h-64 mt-10"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-5">
                <Image
                  src={profile?.imageURL}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <AppText
                  color={theme === "dark" ? `light` : `dark`}
                  className="text-lg font-poppins font-bold"
                >
                  {profile?.fullName}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalShown("editProfile");
                  setVisibleModal(true);
                }}
                className="bg-[#10B981] px-7 py-1 rounded-full"
              >
                <AppText color={theme === "dark" ? `light` : `dark`}>
                  Edit
                </AppText>
              </TouchableOpacity>
            </View>
            <View className="mt-10 gap-2">
              <View>
                <AppText
                  color={theme === "dark" ? `light` : `dark`}
                  className="font-poppins font-bold"
                >
                  Username:
                </AppText>
                <AppText color={theme === "dark" ? `light` : `dark`}>
                  {profile?.username}
                </AppText>
              </View>
              <View>
                <AppText
                  color={theme === "dark" ? `light` : `dark`}
                  className="font-poppins font-bold"
                >
                  Email:
                </AppText>
                <AppText color={theme === "dark" ? `light` : `dark`}>
                  {profile?.email}
                </AppText>
              </View>
            </View>
          </LinearGradient>
        </View>
        <TouchableOpacity
          onPress={() => {
            setModalShown("notification");
            setVisibleModal(true);
          }}
          className={`flex-row justify-between items-center ${theme === "dark" ? `bg-[rgb(83,62,53,0.5)]` : `bg-[rgb(83,62,53,0.1)]`} mx-6 mt-4 px-4 rounded-lg outline-dashed z-30`}
        >
          <AppText
            color={theme === "dark" ? "light" : "dark"}
            className="font-poppins font-bold text-lg"
          >
            Notification Settings
          </AppText>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={40}
            color={theme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
        <Pressable
          onPress={() => {
            setModalShown("appearance");
            setVisibleModal(true);
          }}
          className="flex-row justify-between items-center mx-6 mt-4 px-4 rounded-lg outline-dashed z-30"
        >
          <AppText
            color={theme === "dark" ? "light" : "dark"}
            className="font-poppins font-bold text-lg"
          >
            Appearance
          </AppText>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={40}
            color={theme === "dark" ? "white" : "black"}
            onPress={() => {
              setModalShown("appearance");
              setVisibleModal(true);
            }}
          />
        </Pressable>
        <View className="flex-row mb-4 justify-between items-center mx-6 mt-4 px-4 rounded-lg outline-dashed z-30">
          <AppText
            color={theme === "dark" ? "light" : "dark"}
            className="font-poppins font-bold text-lg"
          >
            Help &#x26; Support
          </AppText>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={40}
            color={theme === "dark" ? "white" : "black"}
            onPress={() => {
              setModalShown("helpAndSupport");
              setVisibleModal(true);
            }}
          />
        </View>

        {!userRated?.$id && (
          <View
            className={`${
              theme === "dark" ? "bg-green-500/80" : "bg-green-500/50 "
            } mt-4 px-4 rounded-lg py-2 mx-8`}
          >
            <Pressable
              onPress={() => {
                setModalShown("rate");
                setVisibleModal(true);
              }}
              className="flex-row justify-between items-center"
            >
              <AppText
                className={`font-poppins font-bold text-lg ${theme === "dark" ? `text-white` : `text-black`}`}
              >
                Rate App
              </AppText>
              <Ionicons
                name="star-outline"
                size={32}
                color={theme === "dark" ? `white` : `#15803d`}
              />
            </Pressable>
          </View>
        )}

        <TouchableOpacity
          style={{ zIndex: 999 }}
          className="flex-row justify-between items-center  mx-8 p-2"
          onPress={() => {
            setModalShown("logout");
            setVisibleModal(true);
          }}
        >
          <AppText
            color={"dark"}
            className="font-poppins font-bold text-lg text-red-600"
          >
            Logout
          </AppText>
          <Ionicons name="exit-outline" size={32} color={"red"} />
        </TouchableOpacity>
        <View className="absolute bottom-0 w-full">
          <BottomNav title="menu" />
        </View>
      </BackgroundGradient>
      <Modal
        visible={visibleModal}
        animationType="slide"
        transparent={
          modalShown === "logout" || modalShown === "rate" ? true : false
        }
        onRequestClose={() => setVisibleModal(false)}
      >
        {modalShown === "notification" && (
          <NotificationSettings setVisibleModal={setVisibleModal} />
        )}
        {modalShown === "appearance" && (
          <AppearanceSettings setVisibleModal={setVisibleModal} />
        )}
        {modalShown === "helpAndSupport" && (
          <HelpAndSupport setVisibleModal={setVisibleModal} />
        )}
        {modalShown === "logout" && (
          <Logout setVisibleModal={setVisibleModal} />
        )}
        {modalShown === "editProfile" && (
          <EditProfile setVisibleModal={setVisibleModal} />
        )}

        {modalShown === "rate" && (
          <ConfirmCancelModal
            heightSize={120}
            padding={12}
            blurIntensity={50}
            borderRounded={12}
            onClose={() => setVisibleModal(false)}
            onCancel={() => setVisibleModal(false)}
            onOk={async () => {
              await handleRateApp(
                profile?.$id || "",
                rate,
                feedback,
                profile?.API_KEY || ""
              );
              setVisibleModal(false);
            }}
          >
            <AppText
              color={theme === "dark" ? `light` : `dark`}
              className="font-bold font-poppins text-sm mt-4 ml-10"
            >
              Enjoying the app? Give us a quick rating!
            </AppText>
            <View className="flex-col  my-auto px-5 w-full pb-10 gap-4">
              <View className=" flex-row items-center justify-center gap-4 pl-5">
                <AntDesign
                  name="star"
                  onPress={() => setRate(1)}
                  size={32}
                  color={rate > 0 ? "#fadb14" : theme === "dark" ? `white` : ""}
                />
                <AntDesign
                  name="star"
                  onPress={() => setRate(2)}
                  size={32}
                  color={rate > 1 ? "#fadb14" : theme === "dark" ? `white` : ""}
                />
                <AntDesign
                  name="star"
                  onPress={() => setRate(3)}
                  size={32}
                  color={rate > 2 ? "#fadb14" : theme === "dark" ? `white` : ""}
                />
                <AntDesign
                  name="star"
                  onPress={() => setRate(4)}
                  size={32}
                  color={rate > 3 ? "#fadb14" : theme === "dark" ? `white` : ""}
                />
                <AntDesign
                  name="star"
                  onPress={() => setRate(5)}
                  size={32}
                  color={rate > 4 ? "#fadb14" : theme === "dark" ? `white` : ""}
                />
              </View>
              <TextInput
                multiline
                placeholder="(Required)"
                textAlignVertical="top"
                value={feedback}
                onChangeText={setFeedback}
                placeholderTextColor="#6b7280"
                className={`border-[1px] ${theme === "dark" ? `text-[#E8C282]` : `text-slate-800`} p-4 border-gray-500 h-28 w-full rounded-lg`}
              />
              <View className="w-full ">
                <AppText className="font-bold font-poppins text-start text-xs text-slate-500">
                  {`(${feedback.length}/1500)`}
                </AppText>
              </View>
            </View>
          </ConfirmCancelModal>
        )}
      </Modal>
    </SafeAreaView>
  );
}
