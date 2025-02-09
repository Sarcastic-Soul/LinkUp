import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '../../components/Home/HomeHeader'

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen
                name="home"
                options={{
                    header: () => <HomeHeader />
                }}
            />
            <Stack.Screen
                name="profile"
                options={{
                   headerShown: false
                }}
            />
        </Stack>
    )
}
