import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import text from "@/constants/text";
import { useRouter } from "expo-router";

type Props = {
    selectedAmountOfPeople: number,
    setSelectedAmountOfPeople: (num: number) => void
    openTableModalVisible: boolean,
    setOpenTableModalVisible: (bool: boolean) => void,
    name: string,
    tableId: number
    openTable: () => void
}

function TableOpenModal(props: Props) {

    const options = Array.from({ length: 12 }, (_, index) => index + 1); // Create options from 1 to 12

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.openTableModalVisible}
            onRequestClose={() => props.setOpenTableModalVisible(false)}
        >
            <View className="flex w-full h-full justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
                {/* Modal Content */}
                <View className="rounded bg-white w-80 p-2">
                    <View className="flex-row justify-between items-center py-2">
                        <Text className="text-xl font-bold">{props.name}</Text>
                        <Pressable onPress={() => { props.setOpenTableModalVisible(false); props.setSelectedAmountOfPeople(0) }}>
                            <FontAwesome name="window-close" size={24} color="#F46F46CC" />
                        </Pressable>
                    </View>
                    <Text>{text.numberOfPeople}</Text>
                    <View className='flex flex-wrap flex-row justify-center'>
                        {options.map((value) => (
                            <TouchableOpacity
                                key={value}
                                className="w-16 h-16 m-2 flex items-center justify-center border border-gray-300 rounded"
                                style={{ backgroundColor: `${props.selectedAmountOfPeople === value ? '#F46F46CC' : 'white'}` }}
                                onPress={() => props.setSelectedAmountOfPeople(value)}
                            >
                                <Text
                                    className={`${props.selectedAmountOfPeople === value ? 'text-white' : 'text-black'
                                        }`}
                                >
                                    {value}{text.people}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Pressable onPress={props.openTable}
                        className="rounded-md flex items-center m-3 p-1" style={{ backgroundColor: '#F46F46CC' }}>
                        <Text className="text-lg text-white">{text.confirm}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

export default TableOpenModal
