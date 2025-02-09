import { View, Text, TextInput, Image, TouchableOpacity, Pressable, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Sign In', 'Please fill all the fields');
            return;
        }
        setLoading(true);
        const response = await login(email, password);
        setLoading(false);
        if (response.success) {
            router.push('home');
        } else {
            Alert.alert('Sign In', response.msg);
        };
    }

    return (
        <CustomKeyboardView>
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }} className="flex-1">
                    {/* Logo Section */}
                    <View className="items-center">
                        <Image
                            style={{ height: hp(25) }}
                            resizeMode="contain"
                            source={require('../assets/images/login.png')}
                        />
                    </View>

                    {/* Welcome Text Section */}
                    <View className="items-center gap-4 my-14">
                        <Text className="text-3xl font-bold text-gray-800">Welcome Back</Text>
                        <Text className="text-gray-500 text-lg">Sign in to continue</Text>
                    </View>

                    {/* Input Fields Section */}
                    <View className="items-center">
                        <View
                            style={{ width: wp(80), height: hp(7) }}
                            className="flex-row gap-4 px-4 bg-neutral-100 rounded-2xl items-center"
                        >
                            <Feather name="mail" size={24} color="gray" />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                style={{ flex: 1 }}
                                placeholder="Email Address"
                                placeholderTextColor="gray"
                            />
                        </View>
                        <View
                            style={{ width: wp(80), height: hp(7) }}
                            className="flex-row gap-4 mt-6 mb-2 px-4 bg-neutral-100 rounded-2xl items-center"
                        >
                            <Feather name="lock" size={24} color="gray" />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                style={{ flex: 1 }}
                                placeholder="Password"
                                placeholderTextColor="gray"
                                secureTextEntry
                            />
                        </View>
                        <View style={{ width: wp(80) }} className="items-end">
                            <Text className="text-gray-400 font-semibold">Forgot Password?</Text>
                        </View>
                    </View>

                    {/* Sign-In Button */}
                    <View>
                        {
                            loading ? (
                                <View className="flex-row justify-center">
                                    <Loading size={hp(15)} />
                                </View>
                            ) : (
                                <View className="items-center my-6">
                                    <TouchableOpacity
                                        style={{ width: wp(80), height: hp(7) }}
                                        className="bg-indigo-500 rounded-2xl items-center justify-center"
                                        onPress={handleLogin}
                                    >
                                        <Text className="text-white text-lg font-semibold">Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>

                    {/* Sign-Up Redirect */}
                    <View className="items-center justify-center">
                        <Text className="text-gray-500">Don't have an account?{' '}</Text>
                        <Pressable onPress={() => router.push('signUp')}>
                            <Text className="text-indigo-500 font-semibold">Sign Up</Text>
                        </Pressable>
                    </View>
                </View >
            </ScrollView>
        </CustomKeyboardView>
    );
}
