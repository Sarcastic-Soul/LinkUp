import "../global.css";
import React, { useEffect } from "react";
import { MenuProvider } from 'react-native-popup-menu';
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthContextProvider, useAuth } from "../context/authContext";

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    //check if user is authenticated
    useEffect(() => {
        if (typeof isAuthenticated === "undefined") return;

        const inApp = segments[0] == '(app)';
        if (isAuthenticated && !inApp) {
            //redirect user to Home page
            router.replace('home');
        } else if (isAuthenticated === false) {
            //redirect user to Sign in page
            router.replace('signIn');
        }
    }, [isAuthenticated])
    return <Slot />
}


export default function RootLayout() {
    return (
        <MenuProvider>
            <AuthContextProvider>
                <MainLayout />
            </AuthContextProvider>
        </MenuProvider>
    )
}
