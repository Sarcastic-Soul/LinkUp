
import React from 'react'
import { View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loading from '../components/Loading';

export default function StartPage() {
    return (
        <View className="flex-1 justify-center items-center">
            <Loading size={hp(30)} />
        </View>
    )
}
