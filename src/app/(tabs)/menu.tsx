import AppearanceSettings from "@/src/components/AppearanceSettings";
import { AppText } from "@/src/components/AppText";
import BottomNav from "@/src/components/BottomNav";
import EditProfile from "@/src/components/EditProfile";
import HeaderNav from "@/src/components/HeaderNav";
import HelpAndSupport from "@/src/components/HelpAndSupport";
import Logout from "@/src/components/Logout";
import NotificationSettings from "@/src/components/NotificationSettings";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Menu() {
  const { profile } = useAuth();
  const { theme } = useTheme();
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalShown, setModalShown] = useState("");

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className={`${theme === "dark" ? `bg-slate-900/50` : `bg-[#FFECCC]`} flex-1 relative`}
      >
        <View className="absolute z-10">
          <LinearGradient
            style={{
              height: 600,
              width: 400,
              borderRadius: 200,
              transform: "rotate(270deg)",
              top: -310,
            }}
            colors={["#10B981", "#CED7CF"]}
          />
        </View>
        <View className={` z-20 gap-4 p-6`}>
          <HeaderNav arrow={true} title="" />
          <LinearGradient
            colors={["#CED7CF", "#10B981"]}
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
                  color="dark"
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
                <AppText color="light">Edit</AppText>
              </TouchableOpacity>
            </View>
            <View className="mt-10 gap-2">
              <View>
                <AppText className="font-poppins font-bold">Username:</AppText>
                <AppText>{profile?.username}</AppText>
              </View>
              <View>
                <AppText className="font-poppins font-bold">Email:</AppText>
                <AppText>{profile?.email}</AppText>
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
        <View className="flex-row justify-between items-center mx-6 mt-4 px-4 rounded-lg outline-dashed z-30">
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
        <View
          className={`${theme === "dark" ? `bg-[rgb(83,62,53,0.5)]` : `bg-[rgb(83,62,53,0.1)]`} mx-6 mt-4 px-4 rounded-lg outline-dashed`}
        >
          <Pressable
            onPress={() => {
              setModalShown("logout");
              setVisibleModal(true);
            }}
            className="flex-row justify-between items-center"
          >
            <AppText
              color={"dark"}
              className="font-poppins font-bold text-lg text-red-600"
            >
              Logout
            </AppText>
            <Ionicons name="exit-outline" size={32} color={"red"} />
          </Pressable>
        </View>
      </ScrollView>
      <View
        className={`${theme === "dark" ? `bg-slate-900/50` : `bg-[#FFECCC]`}`}
      >
        <BottomNav title="menu" />
      </View>
      <Modal
        visible={visibleModal}
        animationType="slide"
        transparent={modalShown === "logout" ? true : false}
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
      </Modal>
    </SafeAreaView>
  );
}
