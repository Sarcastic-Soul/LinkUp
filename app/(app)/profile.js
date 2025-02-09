import React, { useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";

import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { useAuth } from '../../context/authContext';
import { cloudId, uploadPreset, apiKey } from '../../utils/cloudinary';
import Loading from '../../components/Loading';

export default function Profile() {
    const { logout, updateUser } = useAuth();
    const router = useRouter();
    const { profileUrl, username, userId } = useLocalSearchParams();
    const [profileImageUrl, setProfileImageUrl] = useState(profileUrl);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility


    const handleLogout = async () => {
        await logout();
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Function to select and compress an image
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const compressedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 800 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
            setSelectedProfileImage(compressedImage.uri);
        }
    };

    // Function to upload image to Cloudinary
    const uploadImage = async () => {
        if (!selectedProfileImage) return null;

        setLoading(true);
        try {
            let formData = new FormData();
            formData.append('file', {
                uri: selectedProfileImage,
                type: 'image/jpeg',
                name: `${username}.jpg`,
            });

            formData.append('upload_preset', uploadPreset);
            formData.append('api_key', apiKey);

            let response = await fetch(`https://api.cloudinary.com/v1_1/${cloudId}/upload`, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            let data = await response.json();
            return data.secure_url;
        } catch (error) {
            Alert.alert('Upload Failed', 'Could not upload image');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Function to update the user profile image
    const updateUserProfileImage = async () => {
        const imageUrl = await uploadImage();
        if (!imageUrl) return;

        try {
            setProfileImageUrl(imageUrl);
            setSelectedProfileImage(null);
            await updateUser(userId, { profileUrl: imageUrl });
            console.log('Profile image updated!');
        } catch (error) {
            Alert.alert('Error', 'Could not update profile');
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            <View
                className="flex flex-row items-center justify-between bg-indigo-400 rounded-b-3xl elevation-2xl"
                style={{ height: hp(18), paddingHorizontal: wp(5) }}
            >
                <Pressable onPress={() => router.back()} className="p-2">
                    <Feather name="chevron-left" size={28} color="white" />
                </Pressable>

                <Pressable onPress={toggleModal}>
                    <Image
                        style={{ height: hp(12), aspectRatio: 1, borderRadius: 100, borderWidth: 3, borderColor: 'white' }}
                        source={profileImageUrl}
                    />
                </Pressable>

                <View className="w-10" />
            </View>


            <View className="items-center mt-12">
                <Text className="text-4xl font-semibold text-gray-700">{username}</Text>
                <Text className="text-gray-500 text-lg mt-1">User ID: {userId}</Text>
            </View>

            <TouchableOpacity onPress={pickImage} className="items-center mt-4">
                <View className="w-32 h-32 bg-neutral-200 rounded-full justify-center items-center">
                    {selectedProfileImage ? (
                        <Image source={{ uri: selectedProfileImage }} style={{ width: '100%', height: '100%', borderRadius: 999 }} />
                    ) : (
                        <Feather name="camera" size={hp(5)} color="gray" />
                    )}
                </View>
                <Text className="text-gray-500 mt-2">Upload Profile Image</Text>
            </TouchableOpacity>

            {selectedProfileImage && (
                loading ? (
                    <View className="flex-row justify-center">
                        <Loading size={hp(15)} />
                    </View>
                ) : (
                    <TouchableOpacity onPress={updateUserProfileImage} className="items-center mt-4">
                        <View className="w-40 h-10 bg-blue-500 rounded-2xl justify-center items-center">
                            <Text className="text-white font-semibold text-lg">Save Image</Text>
                        </View>
                    </TouchableOpacity>
                )
            )}

            <Pressable
                onPress={handleLogout}
                style={{ width: wp(40), height: hp(6) }}
                className="mt-8 bg-red-500 py-3 rounded-full self-center shadow-md flex justify-center items-center"
            >
                <Text className="text-white text-lg font-medium text-center">Logout</Text>
            </Pressable>


            <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                onBackButtonPress={toggleModal}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.8}
            >
                <View className='flex-1 justify-center items-center'>
                    <Pressable onPress={toggleModal}>
                        <Image
                            source={{ uri: profileImageUrl }}
                            style={{ width: hp(40), height: hp(40), borderRadius: 10 }}
                            transition={100}
                        />
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
}
