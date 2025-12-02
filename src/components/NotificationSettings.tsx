import { Profile } from "@/types";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { SafeAreaView, Switch, View } from "react-native";
import { updateMarket, updateMessage, updateNotif } from "../action/userAction";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { AppText } from "./AppText";
import BackgroundGradient from "./BackgroundGradient";
import Loading from "./LoadingComponent";

type NotificationProps = {
  setVisibleModal: (visible: boolean) => void;
};

const NotificationSettings = ({ setVisibleModal }: NotificationProps) => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const { profile, setProfile } = useAuth();

  const toggleSwitch = async (notifSettings: string) => {
    try {
      setLoading(true);

      let updatedProfile = { ...profile };
      switch (notifSettings) {
        case "notif":
          updatedProfile = {
            ...updatedProfile,
            notif: !updatedProfile.notif,

            messageAlert: !updatedProfile.messageAlert,
            marketAlert: !updatedProfile.marketAlert,
          };
          await updateNotif(profile);
          break;

        case "message":
          updatedProfile = {
            ...updatedProfile,
            messageAlert: !updatedProfile.messageAlert,
          };
          await updateMessage(profile);
          break;

        case "market":
          updatedProfile = {
            ...updatedProfile,
            marketAlert: !updatedProfile.marketAlert,
          };
          await updateMarket(profile);
          break;
      }

      setProfile(updatedProfile as Profile);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFECCC] items-center justify-center">
        <Loading className="h-12 w-12" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1  `}>
      <BackgroundGradient className="flex-1 p-6 gap-2">
        <FontAwesome5
          name="arrow-left"
          size={20}
          onPress={() => setVisibleModal(false)}
          color={theme === "dark" ? `white` : `black`}
        />
        <AppText
          color={theme === "dark" ? `light` : `dark`}
          className="font-poppins font-bold text-xl mt-5"
        >
          Notification Settings
        </AppText>
        <View className="flex-row justify-between items-center border-b-[0.5px] border-[#046A10] pb-2">
          <AppText
            color={theme === "dark" ? `light` : `dark`}
            className="font-poppins text-lg"
          >
            Enable notifications
          </AppText>
          <Switch
            trackColor={{ false: "#767577", true: "#009A1C" }}
            thumbColor={profile?.notif ? "white" : "#f4f3f4"}
            onValueChange={() => {
              toggleSwitch("notif");
            }}
            value={profile?.notif}
          />
        </View>
        <View className="flex-col justify-between items-center border-b-[0.5px] border-[#046A10] pb-4">
          <View className="flex-row justify-between items-center w-full">
            <AppText
              color={theme === "dark" ? `light` : `dark`}
              className="font-poppins text-lg font-medium"
            >
              Rubber market price
            </AppText>
            <Switch
              disabled={profile?.notif ? false : true}
              trackColor={{ false: "#767577", true: "#009A1C" }}
              thumbColor={profile?.marketAlert ? "white" : "#f4f3f4"}
              onValueChange={() => {
                toggleSwitch("market");
              }}
              value={profile?.marketAlert}
            />
          </View>
          <View className="flex-row justify-between items-center  w-full">
            <AppText
              color={theme === "dark" ? `light` : `dark`}
              className="font-poppins text-lg font-medium"
            >
              Message alerts
            </AppText>
            <Switch
              disabled={profile?.notif ? false : true}
              trackColor={{ false: "#767577", true: "#009A1C" }}
              thumbColor={profile?.messageAlert ? "white" : "#f4f3f4"}
              onValueChange={() => {
                toggleSwitch("message");
              }}
              value={profile?.messageAlert}
            />
          </View>
        </View>
      </BackgroundGradient>
    </SafeAreaView>
  );
};

export default NotificationSettings;
