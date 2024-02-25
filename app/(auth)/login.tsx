import text from "@/constants/text";
import { useUserLoginMutation } from "@/gql/schema";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import JWTManager from "@/utils/jwt";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

type Props = {};

const Login = (props: Props) => {
  const { setIsAuthenticated } = useAuthContext();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login] = useUserLoginMutation();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data, errors } = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
      if (data?.userLogin?.data?.accessToken) {
        JWTManager.setToken(data.userLogin.data.accessToken);
        setIsAuthenticated(true);
        router.push("/(tabs)/menu");
      }
    } catch (e) {
      console.log("e: ", e);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View className="shadow-2xl w-80 p-4 items-center">
        <Text className="text-xl mb-4">{text.login}</Text>
        <View className="w-full mb-4">
          <Text className="mb-2">{text.email}: </Text>
          <TextInput
            className="h-10 p-3 border border-solid border-black"
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
          />
        </View>
        <View className="w-full">
          <Text className="mb-2">{text.password}: </Text>
          <TextInput
            secureTextEntry={true}
            className="h-10 p-3 border border-solid border-black"
            onChangeText={(text) => setPassword(text)}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          className="bg-primary rounded-3xl h-9 w-28 justify-center items-center mt-4"
          onPress={handleLogin}
        >
          <Text className="text-white font-medium">{text.login}</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require("@/assets/images/dinii-logo.png")}
        className="absolute bottom-4 right-4 w-[120px] h-[44px]"
        resizeMode="cover"
      />
    </SafeAreaView>
  );
};

export default Login;
