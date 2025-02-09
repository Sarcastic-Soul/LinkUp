import React, { useEffect, useRef, useState } from 'react'
import { Alert, Keyboard, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';

import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

import { getRoomId } from '../../utils/common';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/authContext';
import MessageList from '../../components/Chat/MessageList';
import ChatRoomHeader from '../../components/Chat/ChatRoomHeader';
import CustomKeyboardView from '../../components/CustomKeyboardView';

export default function ChatRoom() {
    const item = useLocalSearchParams();
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        createRoomIfNotExists();
        let roomId = getRoomId(user?.userId, item?.userId);
        const docRef = doc(db, 'rooms', roomId);
        const messageRef = collection(docRef, 'messages');
        const q = query(messageRef, orderBy('createdAt', 'asc'));

        let unsub = onSnapshot(q, (querySnapshot) => {
            let allMessages = querySnapshot.docs.map(doc => doc.data());
            setMessages([...allMessages]);
        });

        const KeyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
        )

        return () => {
            unsub();
            KeyboardDidShowListener.remove();
        }

    }, []);

    useEffect(() => {
        updateScrollView();
    }, [messages])


    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: false });
        }, 100);
    }

    const createRoomIfNotExists = async () => {
        let roomId = getRoomId(user?.userId, item?.userId);
        await setDoc(doc(db, 'rooms', roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date()),
            users: [user?.userId, item?.userId],
            lastMessageTime: new Date().toISOString(),
        })
    }

    const handleSendMessage = async () => {
        let message = textRef.current.trim();
        if (!message) return;
        try {
            let roomId = getRoomId(user?.userId, item?.userId);
            let docRef = doc(db, 'rooms', roomId);
            const messageRef = collection(docRef, 'messages');
            const newDoc = await addDoc(messageRef, {
                userId: user?.userId,
                sendername: user?.username,
                text: message,
                createdAt: Timestamp.fromDate(new Date()),
            });

            textRef.current = '';
            if (inputRef) inputRef.current?.clear();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    return (
        <CustomKeyboardView inChat={true}>
            <View className="flex-1 bg-white">
                <StatusBar style="dark" />
                <ChatRoomHeader user={item} router={router} />

                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1"
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <MessageList messages={messages} currentUser={user} />
                </ScrollView>

                <View style={{ marginBottom: hp(1.7) }} className="pt-2 bg-white">
                    <View className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-100 rounded-full items-center">
                        <TextInput
                            ref={inputRef}
                            onChange={(e) => textRef.current = e.nativeEvent.text}
                            placeholder='Type message...'
                            style={{ fontSize: hp(2) }}
                            className="flex-1 px-3 text-lg"
                        />
                        <TouchableOpacity
                            onPress={handleSendMessage}
                            className="bg-indigo-500 p-2 mr-[1px] rounded-full"
                        >
                            <Feather name="send" size={hp(2.7)} color="#f5f5f5" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    )
}
