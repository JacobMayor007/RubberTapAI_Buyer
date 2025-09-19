import { AppText } from "@/src/components/AppText";
import BottomNav from "@/src/components/BottomNav";
import { Button } from "@/src/components/Button";
import HeaderNav from "@/src/components/HeaderNav";
import RubberPrice from "@/src/components/RubberPrice";
import ViewDetails from "@/src/components/ViewDetails";
import { globalFunction } from "@/src/global/fetchWithTimeout";
import { Product } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useState } from "react";
import { Image, Modal, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  // const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts();
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
