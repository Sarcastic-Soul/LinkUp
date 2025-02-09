import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { blurhash } from '../../utils/common';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'expo-router';


export default function HomeHeader() {
    const router = useRouter();
    const { top } = useSafeAreaInsets();
    const { user } = useAuth();

    const handleProfile = () => {
        router.push({
            pathname: 'profile',
            params: {
                profileUrl: user?.profileUrl,
                username: user?.username,
                userId: user?.userId
            }
        });
    };

    return (
        <View>
            <View
                style={{
                    paddingTop: top + 10,
                    paddingHorizontal: wp(5),
                    height: hp(8),
                }}
                className="flex-row justify-between pb-6 rounded-b-3xl shadow-lg bg-indigo-500 items-center"
            >
                <Text style={{ fontSize: hp(3) }} className="text-white font-medium">Chats</Text>
                <View>
                    <Pressable onPress={handleProfile}>
                        <Image
                            style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
                            source={user?.profileUrl}
                            placeholder={{ blurhash }}
                            transition={100}
                        />
                    </Pressable>

                </View>
            </View>
        </View>
    );
}