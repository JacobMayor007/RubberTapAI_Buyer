import { AppText } from "@/src/components/AppText";
import BackgroundGradient from "@/src/components/BackgroundGradient";
import BottomNav from "@/src/components/BottomNav";
import { Button } from "@/src/components/Button";
import HeaderNav from "@/src/components/HeaderNav";
import RubberPrice from "@/src/components/RubberPrice";
import ViewDetails from "@/src/components/ViewDetails";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import { globalFunction } from "@/src/global/fetchWithTimeout";
import { Product } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const { user, profile } = useAuth();
  const [modal, setModal] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    getProducts();
    registerForPushNotificationsAsync();
  }, []);

  const getProducts = async () => {
    try {
      const response = await globalFunction.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_BASE_URL}/products`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
        20000
      );

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  useEffect(() => {
    (async () => {
      try {
        const newToken = await registerForPushNotificationsAsync();

        if (newToken && profile?.API_KEY) {
          if (newToken !== profile?.pushToken) {
            console.log("Token changed — updating Appwrite...");
            await insertNotificationToken(newToken);
          } else {
            console.log("Token is up to date — no update needed.");
          }
        }
      } catch (error) {
        console.error("Push Notification Setup Error:", error);
      }
    })();
  }, [profile?.API_KEY]);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!"
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

        await insertNotificationToken(pushTokenString);

        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications"
      );
    }
  }

  const insertNotificationToken = async (pushToken: string) => {
    try {
      const result = await globalFunction.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_BASE_URL}/push-token`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            userId: user?.$id,
            token: pushToken,
            API_KEY: profile?.API_KEY,
          }),
        },
        20000
      );

      const response = await result.json();

      console.log(response.status);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    return products.filter((p) =>
      [p.category, p.city, p.price?.toString()]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, products]);

  return (
    <SafeAreaView className="flex-1 flex-col justify-between">
      <BackgroundGradient className="flex-1">
        <ScrollView
          className="relative"
          contentContainerStyle={{
            flexGrow: 1,
            position: "relative",
          }}
        >
          <View className="z-20 p-6">
            <HeaderNav title="Dashboard" />
            <RubberPrice />
            <AppText
              color={theme === "dark" ? `light` : `dark`}
              className="mt-5 mb-4 font-poppins font-bold text-xl"
            >
              Latex & Waste Rubber Trade
            </AppText>
            <View
              className={`h-11 px-4 mb-8 rounded-full ${theme === "dark" ? `bg-[#626262]` : `bg-[#e0ccac]`} flex-row items-center gap-1`}
            >
              <Feather name="search" color="white" size={18} />
              <TextInput
                placeholder="Search"
                placeholderTextColor={"#FFFFFF"}
                className={`w-11/12 text-base items-center ${theme === "dark" ? `text-white` : `text-black`} font-bold`}
                onChangeText={(e) => setSearch(e)}
                value={search}
              />
            </View>

            {filteredProducts.map((data, index) => {
              return (
                <View
                  key={index}
                  className={`w-full gap-4 p-4 ${theme === "dark" ? `bg-[#626262]` : `bg-[#F3E0C1]`} flex-row mb-4`}
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 4px 8px",
                    borderRadius: 10,
                  }}
                >
                  <Image
                    src={data?.productURL}
                    borderRadius={10}
                    width={175}
                    height={150}
                  />
                  <View className="flex flex-col gap-1 w-1/2">
                    <AppText
                      color={theme === "dark" ? `light` : "dark"}
                      className="capitalize font-bold font-poppins text-xl"
                    >
                      {data?.category}
                    </AppText>
                    <AppText
                      color={theme === "dark" ? `light` : "dark"}
                      className="mt-2 text-lg font-bold"
                    >
                      <FontAwesome6 name="peso-sign" />
                      {data?.price}
                      {" /kg"}
                    </AppText>
                    <AppText
                      color={theme === "dark" ? `light` : "dark"}
                      className="mb-3 text-sm"
                    >
                      {data?.city}
                    </AppText>
                    <Button
                      style={{
                        alignSelf: "flex-end",
                      }}
                      title="View Details"
                      className="py-1 px-2 font-bold mr-2"
                      color="light"
                      onPress={() => {
                        setModal(true);
                        setViewProduct(data);
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View>
          <BottomNav title="home" />
        </View>
        <Modal
          animationType="slide"
          visible={modal}
          onRequestClose={() => setModal(false)}
          transparent
        >
          <ViewDetails setModal={setModal} product={viewProduct} />
        </Modal>
      </BackgroundGradient>
    </SafeAreaView>
  );
}
