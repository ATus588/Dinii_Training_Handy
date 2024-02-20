import text from "@/constants/text";
import { useCreateOrderMutation, useUserMenusSubscription } from "@/gql/schema";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

export type OrderItem = {
  menuId: number;
  quantity: number;
};

const Menus = (props: Props) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderButtonVisible, setOrderButtonVisible] = useState<boolean>(false);
  const navigation = useNavigation();
  const { data } = useUserMenusSubscription();

  const [createOrder] = useCreateOrderMutation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      title: text.menu,
      // headerRight: () => (
      //   <Pressable className="mr-4" onPress={() => router.push("/create-menu")}>
      //     <FontAwesome5 name="shopping-cart" size={20} color="black" />
      //   </Pressable>
      // ),
    });
  }, []);

  const handleAddToCart = (menuId: number) => {
    const addedOrderItem = orderItems.find(
      (orderItem) => orderItem.menuId === menuId
    );
    if (!addedOrderItem) return;
    setOrderItems((state) => [
      ...state.filter((orderItem) => orderItem.menuId != menuId),
      {
        menuId,
        quantity:
          addedOrderItem.quantity + 1 > 99 ? 99 : addedOrderItem.quantity + 1,
      },
    ]);
  };

  const handleRemoveFromCart = (menuId: number) => {
    const addedOrderItem = orderItems.find(
      (orderItem) => orderItem.menuId === menuId
    );
    if (!addedOrderItem) return;
    setOrderItems((state) => [
      ...state.filter((orderItem) => orderItem.menuId != menuId),
      {
        menuId,
        quantity:
          addedOrderItem.quantity - 1 < 0 ? 0 : addedOrderItem.quantity - 1,
      },
    ]);
  };

  const resetOrderItems = () => {
    if (data?.menus) {
      setOrderItems(
        data.menus.map((menu) => ({ menuId: menu.id, quantity: 0 }))
      );
    }
  };

  useEffect(() => {
    resetOrderItems();
  }, [data]);

  useEffect(() => {
    if (orderItems.some((orderItem) => orderItem.quantity > 0)) {
      setOrderButtonVisible(true);
    } else {
      setOrderButtonVisible(false);
    }
  }, [orderItems]);

  const getTotalPrice = () => {
    return orderItems.reduce((acc, orderItem) => {
      const menu = data?.menus.find((menu) => menu.id === orderItem.menuId);
      if (!menu) return acc;
      return acc + menu.price * orderItem.quantity;
    }, 0);
  };

  const handleOrder = async () => {
    const orderItemsFilterd = orderItems.filter(
      (orderItem) => orderItem.quantity > 0
    );
    const { data } = await createOrder({
      variables: {
        createOrderInput: {
          orderItems: orderItemsFilterd.map((orderItem) => ({
            menuId: orderItem.menuId,
            quantity: orderItem.quantity,
          })),
        },
      },
    });
    if (data?.createOrder.data) {
      resetOrderItems();
    }
  };

  if (!data?.menus) return null;
  return (
    <SafeAreaView className="box-border h-full">
      {/* <View className="">
        <View>
          <Text className="text-lg text-right px-4 mb-2">{text.display}</Text>
        </View>
        <View className="border-[0.5px] mb-3 border-slate-300" />
      </View> */}
      <FlatList
        data={data.menus}
        renderItem={({ item }) => (
          <View className="p-1 mx-2">
            <View className="flex-row justify-between items-center">
              <View className="flex-row">
                <Image
                  className="h-14 w-14"
                  resizeMode="cover"
                  source={{ uri: item.avatar }}
                />
                <View className="mx-2 ">
                  <Text className=" max-w-[160px]">{item.name}</Text>
                  <Text>{item.price}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1">
                <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)}>
                  <Entypo name="minus" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                  className="h-8 px-2 min-w-[48px] text-center border border-solid border-black text-black"
                  value={
                    orderItems
                      .find((orderItem) => orderItem.menuId === item.id)
                      ?.quantity.toString() ?? "0"
                  }
                  readOnly
                />
                <TouchableOpacity onPress={() => handleAddToCart(item.id)}>
                  <Entypo name="plus" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="border-[0.5px] border-slate-300 mt-3" />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      {orderButtonVisible && (
        <View className="px-3 bottom-4 fixed">
          <TouchableOpacity
            className="bg-primary rounded-3xl h-9 w-full justify-center items-center"
            onPress={handleOrder}
          >
            <View className="flex w-full flex-row justify-between items-center text-white px-4">
              <Text className="text-white">{text.order}</Text>
              <Text className="text-white font-medium">
                {getTotalPrice()} {text.yen}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Menus;