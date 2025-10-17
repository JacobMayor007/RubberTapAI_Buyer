import { AppText } from "@/src/components/AppText";
import BottomNav from "@/src/components/BottomNav";
import { Button } from "@/src/components/Button";
import HeaderNav from "@/src/components/HeaderNav";
import RubberPrice from "@/src/components/RubberPrice";
import ViewDetails from "@/src/components/ViewDetails";
import { useAuth } from "@/src/contexts/AuthContext";
import { globalFunction } from "@/src/global/fetchWithTimeout";
import { Product } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
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
  const [rubberPrice, setRubberPrice] = useState("");
  const [weekChange, setWeekChange] = useState("");

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

  useEffect(() => {
    const getRubberPrice = async () => {
      const rubberPriceExist = await AsyncStorage.getItem("rubber_price");
      const weekChangeExist = await AsyncStorage.getItem("week_change");
      const todayStorage = await AsyncStorage.getItem("today_date");
      const now = dayjs().format("YYYY-MM-DD");
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

      console.log("Rubber Price async: ", rubberPriceExist);
      console.log("Week change async", weekChangeExist);

      console.log(todayStorage);
      console.log(yesterday);

      if (todayStorage === null || todayStorage === yesterday) {
        await AsyncStorage.removeItem("rubber_price");
        await AsyncStorage.removeItem("week_change");
        await AsyncStorage.removeItem("today_date");
      } else {
      }

      if (!rubberPriceExist || !weekChangeExist) {
        console.log("It Mount");

        const response = await globalFunction.fetchWithTimeout(
          `${process.env.EXPO_PUBLIC_BASE_URL}/commodity-price`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          },
          20000
        );

        const data = await response.json();

        await AsyncStorage.setItem("rubber_price", data.price);
        await AsyncStorage.setItem("week_change", data.weekchange);
        await AsyncStorage.setItem("today_date", now);
        setRubberPrice(data.price);
        setWeekChange(data.weekchange);

        return;
      } else {
        setRubberPrice(rubberPriceExist);
        setWeekChange(weekChangeExist);

        return;
      }
    };

    getRubberPrice();
  }, []);

  return (
    <SafeAreaView className="flex-1 flex-col justify-between">
      <ScrollView
        className="relative"
        contentContainerStyle={{
          flexGrow: 1,
          position: "relative",
          backgroundColor: "#FFECCC",
        }}
      >
        <View className="absolute z-10">
          <View
            style={{
              height: 500,
              width: 400,
              borderRadius: 170,
              transform: "rotate(180deg)",
              top: -250,
              backgroundColor: "#10B981",
            }}
          />
        </View>

        <View className="z-20 p-6">
          <HeaderNav title="Dashboard" />
          <RubberPrice />
          <AppText className="mt-5 mb-4 font-poppins font-bold text-xl">
            Latex & Waste Rubber Trade
          </AppText>
          <View className="h-11 px-4 mb-8 rounded-full bg-[#e0ccac] flex-row items-center gap-1">
            <Feather name="search" color="white" size={18} />
            <TextInput
              placeholder="Search"
              placeholderTextColor={"#FFFFFF"}
              className="w-11/12 text-base items-center"
              onChangeText={(e) => setSearch(e)}
              value={search}
            />
          </View>

          {products.map((data, index) => {
            return (
              <View
                key={index}
                className="w-1/2 gap-1 p-4 bg-[#F3E0C1]"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 4px 8px",
                  borderRadius: 10,
                }}
              >
                <Image src={data?.productURL} height={120} />
                <AppText
                  color="dark"
                  className="capitalize font-bold font-poppins text-xl"
                >
                  {data?.category}
                </AppText>
                <AppText className="mt-2">
                  <FontAwesome6 name="peso-sign" />
                  {data?.price}
                  {" /kg"}
                </AppText>
                <AppText className="mb-3">{data?.city}</AppText>
                <Button
                  title="View Details"
                  className="py-1 font-bold"
                  color="light"
                  onPress={() => {
                    setModal(true);
                    setViewProduct(data);
                  }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View className="bg-[#FFECCC]">
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
    </SafeAreaView>
  );
}
