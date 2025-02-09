
import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import ChatItem from '../Chat/ChatItem';
import { useRouter } from 'expo-router';

export default function ChatList({ currentUser, users, onRefresh }) {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await onRefresh();
        
        setRefreshing(false);
    };

    return (
        <View className="flex-1 bg-gray-100">
            <FlatList
                data={users}
                keyExtractor={(item) => item?.userId}
                contentContainerStyle={{ paddingVertical: 15, paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <ChatItem router={router} item={item} index={index} currentUser={currentUser} />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            />
        </View>
    );
}
