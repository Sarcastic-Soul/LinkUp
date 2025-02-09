import axios from "axios";
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '../context/authContext';
import { cloudName, apiKey, apiSecret } from '../utils/cloudinary';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';


export default function SignUp() {
    const router = useRouter();
    const { register } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const getSampleAvatars = async () => {
        const folderPath = "chatApp/profile/sample";
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`;
        const response = await axios.get(url, {
            auth: {
                username: apiKey,
                password: apiSecret,
            },
            params: {
                type: "upload",
                prefix: folderPath,
                max_results: 50, // Adjust as needed
            },
        });

        return response.data.resources.map(img => img.public_id);
    }

    const getProfileImage = async () => {
        const avatars = await getSampleAvatars();
        const randomPublicId = avatars[Math.floor(Math.random() * avatars.length)];
        const link = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/v1/${randomPublicId}`
        return link;
    }

    // Handle user registration
    const handleRegister = async () => {
        if (!email || !password || !username) {
            Alert.alert('Sign Up', 'Please fill all the fields and upload a profile image.');
            return;
        }
        setLoading(true);
        const profileImage = await getProfileImage(); // Get random profile image URL

        const response = await register(email, password, username, profileImage);  // Pass uploaded image URL
        setLoading(false);
    };

    return (
        <CustomKeyboardView>
            <ScrollView
                className="flex-1"
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <StatusBar style="dark" />
                <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }} className="flex-1">
                    <View className="items-center">
                        <Image style={{ height: hp(25) }} resizeMode="contain" source={require('../assets/images/register.png')} />
                    </View>

                    <View className="items-center gap-4 my-14">
                        <Text className="text-3xl font-bold text-gray-800">Join Us</Text>
                        <Text className="text-gray-500 text-lg">Sign Up to continue</Text>
                    </View>

                    <View className="items-center gap-4">
                        <View style={{ width: wp(80), height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center">
                            <Feather name="user" size={24} color="gray" />
                            <TextInput value={username} onChangeText={setUsername} style={{ flex: 1 }} placeholder="Username" placeholderTextColor="gray" />
                        </View>

                        <View style={{ width: wp(80), height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center">
                            <Feather name="mail" size={24} color="gray" />
                            <TextInput value={email} onChangeText={setEmail} style={{ flex: 1 }} placeholder="Email Address" placeholderTextColor="gray" />
                        </View>

                        <View style={{ width: wp(80), height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center">
                            <Feather name="lock" size={24} color="gray" />
                            <TextInput value={password} onChangeText={setPassword} style={{ flex: 1 }} placeholder="Password" placeholderTextColor="gray" secureTextEntry />
                        </View>


                    </View>

                    <View>
                        {loading ? (
                            <View className="flex-row justify-center">
                                <Loading size={hp(15)} />
                            </View>
                        ) : (
                            <View className="items-center my-6">
                                <TouchableOpacity
                                    onPress={handleRegister}
                                    style={{ width: wp(80), height: hp(7) }}
                                    className="bg-indigo-500 rounded-2xl justify-center items-center"
                                >
                                    <Text className="text-white font-semibold text-lg">Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View className="items-center justify-center">
                        <Text className="text-gray-500">Already have an account?{' '}</Text>
                        <Pressable onPress={() => router.push('signIn')}>
                            <Text className="text-indigo-500 font-semibold">Sign In</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </CustomKeyboardView>
    );
}
