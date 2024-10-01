import React, { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import text from "@/constants/text";
import { useRouter } from "expo-router";

type Props = {
    openOptionsModalVisible: boolean,
    setOpenOptionsModalVisible: (bool: boolean) => void,
    name: string,
    tableId: number
}

const TableOptionsModal = (props: Props) => {

    const router = useRouter();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.openOptionsModalVisible}
            onRequestClose={() => props.setOpenOptionsModalVisible(false)}
          >
            <View className="flex w-full h-full justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
              {/* Modal Content */}
              <View className="rounded bg-white w-80 p-2">
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-xl font-bold">{props.name}</Text>
                  <Pressable onPress={() => props.setOpenOptionsModalVisible(false)}>
                    <FontAwesome name="window-close" size={24} color="#F46F46CC" />
                  </Pressable>
                </View>
                {/* Redirect to page */}
                <Pressable onPress={() => {props.setOpenOptionsModalVisible(false);router.push(`/(tabs)/table/${props.tableId}/menu`)}}
                  className="rounded-md flex items-center my-2 p-1" style={{ backgroundColor: '#F46F46CC' }}>
                  <Text className="text-lg text-white">{text.order}</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
    )
}

export default TableOptionsModal;
