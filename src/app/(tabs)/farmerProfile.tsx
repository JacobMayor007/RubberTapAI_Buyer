import { AppText } from "@/src/components/AppText";
import BackgroundGradient from "@/src/components/BackgroundGradient";
import BottomNav from "@/src/components/BottomNav";
import { Button } from "@/src/components/Button";
import ViewDetails from "@/src/components/ViewDetails";
import { useMessage } from "@/src/contexts/MessageContext";
import { useTheme } from "@/src/contexts/ThemeContext";
import { globalFunction } from "@/src/global/fetchWithTimeout";
import { Product } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import dayjs from "dayjs";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sort = [
  {
    key: 0,
    label: "Recently Added",
  },
  {
    key: 1,
    label: "Price: High to Low",
  },
  {
    key: 2,
    label: "Price: Low to High",
  },
];

export default function FarmerProfile() {
  const { theme } = useTheme();
  const { user } = useMessage();
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts();
  }, [user]);

  useEffect(() => {
    handleSort();
  }, [active, products.length]);

  const getProducts = async () => {
    try {
      const response = await globalFunction.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_BASE_URL}/my-product/${user?.$id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
        20000
      );

      const data = await response.json();

      setProducts(
        data.sort(
          (a: Product, b: Product) =>
            dayjs(b.$createdAt).valueOf() - dayjs(a.$createdAt).valueOf()
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSort = () => {
    setProducts((prev) => {
      let sorted = [...prev];
      switch (active) {
        case 0: // Recently Added
          sorted.sort(
            (a, b) =>
              dayjs(b.$createdAt).valueOf() - dayjs(a.$createdAt).valueOf()
          );
          break;
        case 1: // Price: High to Low
          sorted.sort((a, b) => b.price - a.price);
          break;
        case 2: // Price: Low to High
          sorted.sort((a, b) => a.price - b.price);
          break;
      }
      return sorted;
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <BackgroundGradient className="flex-1">
        <ScrollView className="flex-1 ">
          <View className="flex-row items-center gap-4 p-6">
            <Feather
              name="arrow-left"
              size={32}
              color={theme === "dark" ? `#E2C282` : `black`}
              onPress={() => router.back()}
            />
            <AppText
              color={theme === "dark" ? `light` : `dark`}
              className="font-poppins font-bold text-2xl"
            >
              Farmer's Profile
            </AppText>
          </View>
          <View className=" border-y-[1px] border-black p-6 z-50">
            <View className="flex-row items-center gap-4 justify-between">
              <View className="flex-row items-center gap-4">
                <Image
                  source={{ uri: user?.imageURL }}
                  width={60}
                  height={60}
                  borderRadius={120}
                />
                <View className="flex-col gap-1">
                  <AppText className="font-poppins font-bold text-lg text-[#f7eddd]">
                    {user?.fullName}
                  </AppText>
                  <View
                    className={`font-poppins font-bold text-lg bg-[#1eac7c] w-14 py-1 rounded-md text-white flex-row items-center gap-1 justify-center`}
                  >
                    <AntDesign name="star" size={15} color={"white"} />
                    <AppText className="font-poppins text-white font-bold text-lg">
                      {user?.rate}
                    </AppText>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="text-sm py-1.5 bg-[#10B981] rounded-lg items-center px-4 justify-center">
                <Link href={"/(tabs)/messages"}>
                  <AppText
                    className={`font-poppins font-medium ${theme === "dark" ? `text-[#E2C282]` : ``} text-white`}
                  >
                    Message
                  </AppText>
                </Link>
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-6 px-6 relative">
            <View className="flex-row items-center justify-between">
              <AppText
                color={theme === "dark" ? `light` : `dark`}
                className="text-lg font-medium"
              >
                Seller's Items
              </AppText>
              <View className="flex-row items-center gap-4">
                <AppText
                  color={theme === "dark" ? `light` : `dark`}
                  className="text-sm"
                >
                  Sort by
                </AppText>
                <TouchableOpacity
                  onPress={() => setShow((prev) => !prev)}
                  className="flex-row items-center bg-[#10B981] px-2.5 py-1.5 rounded-lg gap-2 relative"
                >
                  <AppText className="text-white">{sort[active].label}</AppText>
                  <MaterialIcons
                    name={show ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    color={"white"}
                    size={28}
                  />
                </TouchableOpacity>
                {show && (
                  <View
                    style={{
                      position: "absolute",
                      zIndex: 100,
                    }}
                    className="bg-[#00A871] -right-2 top-10  gap-2 rounded-lg"
                  >
                    {sort.map((data, index) => {
                      return (
                        <TouchableOpacity
                          className=" py-4 px-[19px] flex-row items-center gap-4"
                          onPress={() => {
                            setActive(data.key);
                            setShow(false);
                          }}
                          key={index}
                        >
                          <AppText className="text-white">
                            {data?.label}
                          </AppText>
                          {index === active && (
                            <View className="bg-[#99FF97] items-center justify-center h-5 w-5 rounded-full">
                              <Feather name="check" color={"#16A326"} />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              zIndex: 0,
            }}
            className="relative z-10 px-6 mt-6 gap-4"
          >
            {products.map((data, index) => {
              return (
                <View
                  key={index}
                  className={`w-full gap-4 p-4 ${theme === "dark" ? `bg-[#626262]` : `bg-[#F3E0C1]`} flex-row`}
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 4px 8px",
                    borderRadius: 10,
                    zIndex: 0,
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
      </BackgroundGradient>
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
