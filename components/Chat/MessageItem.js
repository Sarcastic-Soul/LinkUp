import React from 'react';
import { View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function MessageItem({ message, currentUser }) {
    const isSender = currentUser?.userId === message.userId;

    return (
        <View className={`flex-row items-center ${isSender ? 'justify-end' : 'justify-start'} px-3 my-1`}>
            <View
                style={{
                    maxWidth: wp(75),
                    backgroundColor: isSender ? '#6366f1' : '#F2F2F7',
                    padding: hp(1.5),
                    borderRadius: hp(2),
                    shadowOpacity: 0.1,
                    shadowRadius: 5
                }}
            >
                <Text style={{ color: isSender ? '#FFF' : '#000', fontSize: hp(2) }}>
                    {message.text}
                </Text>
            </View>
        </View>
    );
}
