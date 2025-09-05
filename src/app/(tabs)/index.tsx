import { AppText } from "@/src/components/AppText";
import { useAuth } from "@/src/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const auth = useAuth();
  return (
    <SafeAreaView>
      <AppText color="dark" onPress={() => auth.logout()}>
        Logout
      </AppText>
    </SafeAreaView>
  );
}
