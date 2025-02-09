import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";

import { Image } from 'expo-image';

import { db } from '../../firebaseConfig';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { blurhash, formatDate, getRoomId } from '../../utils/common';

export default function ChatItem({ item, router, currentUser }) {
    const openChatRoom = () => {
        router.push({ pathname: 'chatRoom', params: { ...item } });
    };

    const [lastMessage, setLastMessage] = useState(undefined);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(db, 'rooms', roomId);
        const messageRef = collection(docRef, 'messages');
        const q = query(messageRef, orderBy('createdAt', 'desc'));

        let unsub = onSnapshot(q, (querySnapshot) => {
            let allMessages = querySnapshot.docs.map(doc => doc.data());
            setLastMessage(allMessages[0] ? allMessages[0] : null);
        });

        return unsub;
    }, []);

    const renderTime = () => {
        if (lastMessage) {
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
        return '';
    };

    const renderLastMessage = () => {
        if (typeof lastMessage == 'undefined') return 'Loading...';
        if (lastMessage) {
            if (currentUser?.userId === lastMessage?.userId)
                return "You: " + lastMessage?.text;
            else
                return lastMessage.text;
        } else {
            return 'Say Hi! 👋';
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <>
            <Pressable
                onPress={openChatRoom}
                className="flex-row items-center gap-4 p-4 bg-white rounded-2xl my-2 shadow-lg"
            >
                <Pressable onPress={toggleModal}>
                    <Image
                        source={item?.profileUrl}
                        style={{ width: hp(7), height: hp(7), borderRadius: 100 }}
                        placeholder={blurhash}
                        transition={100}
                    />
                </Pressable>
                <View className="flex-1">
                    <Text className="text-lg font-semibold">{item?.username}</Text>
                    <Text className="text-gray-500 text-sm">{renderLastMessage()}</Text>
                </View>
                <Text className="text-gray-400 text-xs">{renderTime()}</Text>
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
                            source={item?.profileUrl}
                            style={{ width: hp(40), height: hp(40), borderRadius: 10 }}
                            transition={100}
                        />
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}
