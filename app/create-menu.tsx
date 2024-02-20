import text from "@/constants/text";
import {
  MenusDocument,
  useCreateMenuMutation,
  useMenuCategoriesQuery,
  useMenusQuery,
} from "@/gql/schema";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

const CreateMenu = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [category, setCategory] = useState<number>(1);
  const router = useRouter();
  const { data: menuCategoryData, error, loading } = useMenuCategoriesQuery();
  const [createMenu] = useCreateMenuMutation();
  if (loading) return <Text>Loading...</Text>;
  if (error) {
    return <Text>error</Text>;
  }
  if (!menuCategoryData) return <Text>no data</Text>;
  const menuCategoryItems = menuCategoryData.menuCategories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const handleCreateMenu = async () => {
    const { errors } = await createMenu({
      variables: {
        createMenuInput: {
          name: name,
          price: parseInt(price),
          description: description,
          avatar: avatar,
          categoryId: category,
        },
      },
      refetchQueries: [{ query: MenusDocument }],
    });
    if (!errors) {
      router.push("/(tabs)/menu-setting");
    }
  };

  return (
    <SafeAreaView>
      <View className="bg-transparent p-4 items-center">
        <View className="w-full mb-4">
          <Text className="mb-2">{text.name}: </Text>
          <TextInput
            className="h-10 p-3 border border-solid border-black"
            onChangeText={(text) => setName(text)}
            value={name}
          />
        </View>
        <View className="w-full mb-4">
          <Text className="mb-2">{text.price}: </Text>
          <TextInput
            className="h-10 p-3 border border-solid border-black"
            onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
            value={price}
          />
        </View>
        <View className="w-full mb-4">
          <Text className="mb-2">{text.description}: </Text>
          <TextInput
            className="p-3 border border-solid border-black"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            onChangeText={(text) => setDescription(text)}
            value={description}
          />
        </View>
        <View className="w-full mb-4">
          <Text className="mb-2">{text.avatar}: </Text>
          <TextInput
            className="h-10 p-3 border border-solid border-black"
            onChangeText={(text) => setAvatar(text)}
            value={avatar}
          />
        </View>
        <View className="w-full mb-4">
          <Text className="mb-2">{text.category}: </Text>
          <View className="h-10 p-3 border border-solid border-black justify-center">
            <RNPickerSelect
              // style={pickerSelectStyles}
              onValueChange={(value) => setCategory(value)}
              items={menuCategoryItems}
            />
          </View>
        </View>
        <TouchableOpacity
          className="bg-primary rounded-3xl h-9 w-28 justify-center items-center mt-4"
          onPress={handleCreateMenu}
        >
          <Text className="text-white font-medium">{text.create}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default CreateMenu;

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: "gray",
//     color: "black",
//     paddingRight: 30, // to ensure the text is never behind the icon
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderWidth: 1,
//     borderColor: "black",
//     color: "black",
//     paddingRight: 30, // to ensure the text is never behind the icon
//     borderStyle: "solid",
//   },
// });
