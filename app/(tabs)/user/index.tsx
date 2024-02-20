import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import text from "@/constants/text";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserLogoutMutation } from "@/gql/schema";
import { useRouter } from "expo-router";

type Props = {};

const User = (props: Props) => {
  const { logoutClient } = useAuthContext();
  const [userLogout] = useUserLogoutMutation();
  const router = useRouter();
  const logout = async () => {
    try {
      const { data } = await userLogout();

      if (data?.userLogout?.data) {
        router.push("/(auth)/login");
      }
      logoutClient();
    } catch (e) {
      console.log("e: ", e);
    }
  };

  return (
    <SafeAreaView>
      <View className="max-h-[44px] px-4">
        <TouchableOpacity className="h-full justify-center" onPress={logout}>
          <Text>{text.logout}</Text>
        </TouchableOpacity>
        <View className="border-[0.5px] border-slate-300" />
      </View>
    </SafeAreaView>
  );
};

export default User;

const styles = StyleSheet.create({});
