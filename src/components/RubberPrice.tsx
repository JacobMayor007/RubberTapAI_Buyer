import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { View } from "react-native";
import { AppText } from "./AppText";

export default function RubberPrice() {
  return (
    <View className="bg-white p-3 mt-4 rounded-md">
      <View className="flex-row items-center justify-between">
        <AppText color="dark" className="text-xl font-poppins">
          Rubber Price
        </AppText>
        <AppText className="items-center gap-2">
          <FontAwesome6 name="peso-sign" />
          164.40
        </AppText>
      </View>
      <View className="flex-row items-center justify-between">
        <AppText className="font-poppins text-sm">Trading Economics</AppText>
        <AppText className="items-center text-sm text-[#75A90A]">
          <AntDesign name="caretup" />
          16.6%
        </AppText>
      </View>
    </View>
  );
}
