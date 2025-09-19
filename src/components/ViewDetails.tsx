import { Product } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useMessage } from "../contexts/MessageContext";
import { AppText } from "./AppText";
import Loading from "./LoadingComponent";

type ViewDetailsProps = {
  product: Product | null;
  setModal: (visible: boolean) => void;
};

export default function ViewDetails({ product, setModal }: ViewDetailsProps) {
  const { user, setUser } = useMessage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMessageUser = async (chatMate_id: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/chat-mate/${chatMate_id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      setUser(data);

      router.push("/(tabs)/messages");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black/50 items-center justify-center px-3">
        <View className="w-full h-2/5 rounded-lg p-3 bg-[#F3E0C1] items-center justify-center">
          <Loading className="h-16 w-16" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black/50 items-center justify-center px-3">
      <View className="w-full h-4/12 rounded-lg p-3  bg-[#F3E0C1] flex-row gap-3">
        <View className="w-6/12 gap-4">
          <Image
            src={product?.productURL}
            height={120}
            className="rounded-lg"
          />
          <View className="flex-row items-center justify-between">
            <Image
              src={product?.farmerProfile}
              height={40}
              width={40}
              className="rounded-full"
            />
            <View className="flex-col">
              <AppText color="dark" className="font-poppins font-bold">
                {product?.user_fullName}
              </AppText>
              <AppText>{product?.city}</AppText>
            </View>
          </View>
          <View className="flex-col justify-between px-1 gap-1">
            <TouchableOpacity className="text-sm py-1.5 bg-[#10B981]/50 items-center justify-center rounded-lg">
              <AppText className="text-white">View Profile</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleMessageUser(product?.user_id || "")}
              className="text-sm py-1.5 bg-blue-500 rounded-md items-center justify-center"
            >
              <AppText color="light">Message Farmer</AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-6/12 pr-1">
          <Feather
            onPress={() => setModal(false)}
            name="x"
            size={24}
            className="text-right"
            color={"red"}
            style={{ paddingRight: 4 }}
          />
          <AppText
            color="dark"
            className="text-xl capitalize font-poppins font-bold"
          >
            {product?.category}
          </AppText>
          <AppText className="mt-2 tracking-wide">
            <FontAwesome6 name="peso-sign" />
            {product?.price}
            {" /kg"}
          </AppText>
          {(product?.description?.length || 0) < 200 ? (
            <AppText color="dark" className="mt-2">
              {product?.description}
            </AppText>
          ) : (
            <AppText> {product?.description?.slice(0, 200)}... </AppText>
          )}
        </View>
      </View>
    </View>
  );
}
