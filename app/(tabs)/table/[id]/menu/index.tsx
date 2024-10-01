import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { View, Text } from 'react-native'

function index() {
    const {id} = useLocalSearchParams()
  return (
    <View>
        <Text>{id}</Text>
    </View>
  )
}

export default index
