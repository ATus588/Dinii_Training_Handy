import { ETableStatus, useUpdateTableMutation, GetTablesDocument } from "@/gql/schema";
import React, { useState } from "react";
import {
    Pressable,
    Text,
    View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { FontAwesome } from "@expo/vector-icons";
import { TableInfo } from "@/gql/schema";
import text from "@/constants/text";
import TableOptionsModal from "./TableOptionsModal";
import TableOpenModal from "./TableOpenModal";

const TableCard = (table: Omit<TableInfo, 'orders' | 'restaurant'>) => {

    const [openOptionsModalVisible, setOpenOptionsModalVisible] = useState(false)
    const [openTableModalVisible, setOpenTableModalVisible] = useState(false);
    const [selectedAmountOfPeople, setSelectedAmountOfPeople] = useState(0)
    const [updateTable] = useUpdateTableMutation();

    const toast = useToast();

    const openTable = async () => {
        if (selectedAmountOfPeople === 0) toast.show(text.openTablePlsChoose, { type: 'error', placement: 'top', duration: 3000, animationType: 'slide-in' })
        else {
            const { data } = await updateTable({
                variables: {
                    tableId: table.id,
                    amountOfPeople: selectedAmountOfPeople,
                    status: ETableStatus.Inuse
                },
                refetchQueries: [{ query: GetTablesDocument }],
                onCompleted: () => {
                    setSelectedAmountOfPeople(0)
                    setOpenTableModalVisible(false)
                    toast.show(text.openTableSuccess, {
                        type: "success",
                        placement: "bottom",
                        duration: 3000,
                        animationType: "slide-in",
                    });
                }
            })
        }
    }

    if (table.status === ETableStatus.Inuse)
        return (
            <Pressable
                className="rounded-md bg-white w-40 h-40 shadow-md m-2 relative bg-white"
                style={{ backgroundColor: '#F46F46CC' }}
                onLongPress={() => setOpenOptionsModalVisible(true)}
                key={table.id}
            >
                <TableOptionsModal
                    openOptionsModalVisible={openOptionsModalVisible}
                    setOpenOptionsModalVisible={setOpenOptionsModalVisible}
                    tableId={table.id}
                    name={table.name}
                />
                <View className="flex-row justify-between items-center m-2">
                    <Text className="text-white font-bold">{table.name}</Text>
                    <Text className="text-white text-base">{table.amountOfPeople} {text.amountOfPeople}</Text>
                </View>
                <View className="flex-row justify-between items-center m-2">
                    <Text className="text-white font-bold text-xl">{text.yen}</Text>
                    <Text className="text-white text-base">{table.total}</Text>
                </View>
            </Pressable>
        )

    return (
        <Pressable
            className="rounded-md bg-white w-40 h-40 shadow-md m-2 relative bg-white"
            //disabled={table.status === 'INUSE'}
            //style={{ backgroundColor: `${table.status === 'INUSE' ? '#F46F46CC' : 'white'}` }}
            onPress={() => setOpenTableModalVisible(true)}
            key={table.id}
        >
            <TableOpenModal
                selectedAmountOfPeople={selectedAmountOfPeople}
                setSelectedAmountOfPeople={setSelectedAmountOfPeople}
                openTableModalVisible={openTableModalVisible}
                setOpenTableModalVisible={setOpenTableModalVisible}
                name={table.name}
                tableId={table.id}
                openTable={openTable}
            />
            <Text className="m-2" style={{ color: "#F46F46CC" }}>{table.name}</Text>
            <View className="absolute w-full h-full flex justify-center items-center">
                <FontAwesome className="absolute" name="plus" size={48} color="#F46F46CC" />
            </View>
        </Pressable>
    )
}


export default TableCard;
