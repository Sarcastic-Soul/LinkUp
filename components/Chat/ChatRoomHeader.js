
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import { Stack } from 'expo-router';
import { Image } from 'expo-image'
import { Feather } from '@expo/vector-icons';

export default function ChatRoomHeader({ user, router }) {
    return (
        <Stack.Screen
            options={{
                title: '',
                headerShadowVisible: false,
                headerLeft: () => (
                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity onPress={() => {
                            router.back();
                        }}>
                            <Feather name="chevron-left" size={hp(4)} color="#737373" />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-3">
                            <Image
                                source={user?.profileUrl}
                                style={{ height: hp(4.5), aspectRatio: 1, borderRadius: 100 }}
                            />
                            <Text style={{ fontSize: hp(2.5) }} className="text-neutral-700 font-medium">
                                {user?.username}
                            </Text>
                        </View>
                    </View>
                ),
                headerRight: () => (
                    <TouchableOpacity>
                        <Feather name="more-vertical" size={hp(3)} color="#737373" />
                    </TouchableOpacity>
                ),
            }}
        />
    )
}