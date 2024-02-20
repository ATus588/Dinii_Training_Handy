import text from "@/constants/text";
import {
  MenusDocument,
  useMenusQuery,
  useUpdateMenuMutation,
} from "@/gql/schema";
import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { FlatList, Image, Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const Menus = (props: Props) => {
  const navigation = useNavigation();
  const router = useRouter();
  const [updateMenu] = useUpdateMenuMutation();
  const { data } = useMenusQuery();
  const toggleSwitch = async (id: number, isDisplay: boolean) => {
    await updateMenu({
      variables: {
        updateMenuInput: {
          id,
          isDisplay: !isDisplay,
        },
      },
      refetchQueries: [{ query: MenusDocument }],
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      title: text.menuSetting,
      headerRight: () => (
        <Pressable className="mr-4" onPress={() => router.push("/create-menu")}>
          <Entypo name="plus" size={28} color="black" />
        </Pressable>
      ),
    });
  }, []);

  if (!data?.menus) return null;

  return (
    <SafeAreaView className="box-border">
      <View className="">
        <View>
          <Text className="text-lg text-right px-4 mb-2">{text.display}</Text>
        </View>
        <View className="border-[0.5px] mb-3 border-slate-300" />
      </View>
      <FlatList
        data={data.menus}
        renderItem={({ item }) => (
          <View className="p-1 mx-2">
            <View className="flex-row justify-between">
              <View className="flex-row">
                <Image
                  className="h-14 w-14"
                  resizeMode="cover"
                  source={{ uri: item.avatar }}
                />
                <View className="mx-2">
                  <Text>{item.name}</Text>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={item.isDisplay ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(item.id, item.isDisplay)}
                value={item.isDisplay}
              />
            </View>
            <View className="border-[0.5px] border-slate-300 mt-3" />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default Menus;
