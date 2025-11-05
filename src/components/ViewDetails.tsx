import { Product } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useMessage } from "../contexts/MessageContext";
import { useTheme } from "../contexts/ThemeContext";
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
  const { theme } = useTheme();

  const handleMessageUser = async (chatMate_id: string, page: string) => {
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

      if (page === "view farmer") {
        router.push("/(tabs)/farmerProfile");
      } else {
        router.push("/(tabs)/messages");
      }
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
    // <View className="flex-1 bg-black/50 items-center justify-center px-3">
    //   <View className="w-full h-4/12 rounded-lg p-3  bg-[#F3E0C1] flex-row gap-3">
    //     <View className="w-6/12 gap-4">
    //       <Image
    //         src={product?.productURL}
    //         height={120}
    //         className="rounded-lg"
    //       />
    //       <View className="flex-row items-center justify-between">
    //         <Image
    //           src={product?.farmerProfile}
    //           height={40}
    //           width={40}
    //           className="rounded-full"
    //         />
    //         <View className="flex-col">
    //           <AppText color="dark" className="font-poppins font-bold">
    //             {product?.user_username}
    //           </AppText>
    //           <AppText>{product?.city}</AppText>
    //         </View>
    //       </View>
    //       <View className="flex-col justify-between px-1 gap-1">
    //         <TouchableOpacity className="text-sm py-1.5 bg-[#10B981]/50 items-center justify-center rounded-lg">
    //           <AppText className="text-white">View Profile</AppText>
    //         </TouchableOpacity>

    //       </View>
    //     </View>
    //     <View className="w-6/12 pr-1">
    //       <Feather
    //         onPress={() => setModal(false)}
    //         name="x"
    //         size={24}
    //         className="text-right"
    //         color={"red"}
    //         style={{ paddingRight: 4 }}
    //       />
    //       <AppText
    //         color="dark"
    //         className="text-xl capitalize font-poppins font-bold"
    //       >
    //         {product?.category}
    //       </AppText>
    //       <AppText className="mt-2 tracking-wide">
    //         <FontAwesome6 name="peso-sign" />
    //         {product?.price}
    //         {" /kg"}
    //       </AppText>
    //       {(product?.description?.length || 0) < 200 ? (
    //         <AppText color="dark" className="mt-2">
    //           {product?.description}
    //         </AppText>
    //       ) : (
    //         <AppText> {product?.description?.slice(0, 200)}... </AppText>
    //       )}
    //     </View>
    //   </View>
    // </View>
    <View className="bg-black/30 flex-1 flex-col">
      <View
        style={{
          flexGrow: 1,
        }}
        className="items-center flex-col justify-center px-4"
      >
        <View
          className={`${theme === "dark" ? `bg-gray-900` : `bg-[#F3E0C1]`} px-6 pb-6 h-[40%] rounded-xl flex-col`}
        >
          <Feather
            name="x"
            size={32}
            color={theme === "dark" ? `#E2C282` : `gray`}
            onPress={() => setModal(false)}
            className="mb-4 mt-2 self-end"
          />
          <View className="mb-2 gap-4 flex-row">
            <View className="w-[47%]">
              <Image
                className="h-44 rounded-md"
                src={`${product?.productURL}`}
              />
            </View>
            <View className="h-44 justify-between  w-[50%] overflow-hidden flex-col ">
              <View className="overflow-hidden flex-wrap">
                <AppText
                  color={theme === "dark" ? "light" : "dark"}
                  className="font-poppins text-2xl font-bold capitalize"
                >
                  {product?.category}
                </AppText>
                <AppText
                  color={theme === "dark" ? "light" : "dark"}
                  className="font-poppins text-sm font-bold capitalize"
                >
                  <FontAwesome6
                    name="peso-sign"
                    size={14}
                    color={theme === "dark" ? "#E8C282" : "black"}
                  />
                  {"  "}
                  {product?.price} / Kg
                </AppText>
                <View className="flex-row mt-3 gap-2 items-center">
                  <Image
                    src={product?.farmerProfile}
                    height={40}
                    width={40}
                    borderRadius={100}
                  />
                  <View className="">
                    {(product?.user_username?.length ?? 0) > 13 ? (
                      <AppText
                        color={theme === "dark" ? "light" : "dark"}
                        className="font-poppins capitalize font-bold text-lg"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {product?.user_username?.slice(0, 13)}...
                      </AppText>
                    ) : (
                      <AppText
                        color={theme === "dark" ? "light" : "dark"}
                        className="font-poppins capitalize font-bold text-lg"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {product?.user_username ?? ""}
                      </AppText>
                    )}
                    <AppText
                      className={`${theme === "dark" ? "text-[#E2C282]" : "text-slate-500"} font-poppins font-light capitalize`}
                      ellipsizeMode="tail"
                    >
                      {product?.city}
                    </AppText>
                  </View>
                </View>
              </View>
              <View
                style={{ marginTop: 2 }}
                className=" flex flex-row justify-between"
              >
                <TouchableOpacity
                  onPress={() =>
                    handleMessageUser(product?.user_id || "", "view farmer")
                  }
                  className="text-sm py-1.5 bg-[#10B981] rounded-lg items-center px-1.5 justify-center"
                >
                  <AppText
                    className={`font-poppins font-medium ${theme === "dark" ? `text-[#E2C282]` : ``} text-white`}
                  >
                    View Farmer
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleMessageUser(product?.user_id || "", "message")
                  }
                  className="text-sm py-1.5 bg-[#10B981] rounded-lg items-center px-4 justify-center"
                >
                  <AppText
                    className={`font-poppins font-medium ${theme === "dark" ? `text-[#E2C282]` : ``} text-white`}
                  >
                    Message
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <AppText
            color={theme === "dark" ? "light" : "dark"}
            className="text-sm font-poppins py-0.5 leading-6 max-h-32 tracking-wider"
            numberOfLines={5}
          >
            {product?.description}
          </AppText>
        </View>
      </View>
    </View>
  );
}
