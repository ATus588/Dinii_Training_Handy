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
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useToast } from "react-native-toast-notifications";
import * as ImagePicker from "expo-image-picker";
import axiosJWT from "@/utils/axiosJWT";

const CreateMenu = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [category, setCategory] = useState<number>(1);
  const router = useRouter();
  const { data: menuCategoryData, error, loading } = useMenuCategoriesQuery();
  const [createMenu] = useCreateMenuMutation();
  const toast = useToast();

  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const pickImageAsync = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      let localUri = null;
      if (!result.canceled) {
        setSelectedImageUri(result.assets[0].uri);
        localUri = result.assets[0].uri;
      } else {
        alert("You did not select any image.");
      }
      if (!localUri) return;
      // ImagePicker saves the taken photo to disk and returns a local URI to it
      let filename = localUri.split("/").pop();
      if (!filename) return;
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      // Assume "photo" is the name of the form field the server expects
      // if (localUrl && filename && type) {
      formData.append("file", { uri: localUri, name: filename, type });

      const res = await axiosJWT.post(
        "http://192.168.0.106:3008/api/cloudinary/upload",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );

      setAvatar(res.data.data.url);
    } catch (error) {
      console.log("Error", error);
    }
    // }
  };

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
      toast.show(text.createMenuSuccess, {
        type: "success",
        placement: "bottom",
        duration: 3000,
        // offset: 30,
        animationType: "slide-in",
      });
      router.push("/(tabs)/menu-setting");
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
              keyboardType="numeric"
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
          <View className="w-full mb-4 flex-row items-center">
            <Text className="mb-2">{text.avatar}: </Text>
            {selectedImageUri ? (
              <>
                <Image
                  source={{ uri: selectedImageUri }}
                  className="w-20 h-20 rounded-lg ml-4"
                />
                {/* <Button title="Upload Photo" onPress={handleUploadPhoto} /> */}
              </>
            ) : (
              <TouchableOpacity
                className="bg-primary rounded-3xl h-9 w-48 justify-center items-center ml-4"
                onPress={pickImageAsync}
              >
                <Text className="text-white font-medium">
                  {text.uploadAvatar}
                </Text>
              </TouchableOpacity>
            )}
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
      </KeyboardAvoidingView>
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
