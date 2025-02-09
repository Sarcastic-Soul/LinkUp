import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub
    }, [])

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return { sucess: true, data: response?.user }
        } catch (error) {
            let msg = error.message;
            if (msg.includes('auth/invalid-email')) msg = 'Invalid email';
            if (msg.includes('auth/invalid-credential')) msg = 'Invalid credentials';
            return { sucess: false, msg };
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            return { sucess: true };
        } catch (error) {
            return { sucess: false, msg: error.message };
        }
    }

    // Modify register function to accept profile URL (uploaded image URL)
    const register = async (email, password, username, profileUrl) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response?.user);

            await setDoc(doc(db, 'users', response?.user?.uid), {
                username,
                profileUrl: profileUrl,  // Use uploaded image URL here
                userId: response?.user?.uid,
            });

            return { sucess: true, data: response?.user }
        } catch (error) {
            let msg = error.message;
            if (msg.includes('auth/invalid-email')) msg = 'Invalid email';
            return { sucess: false, msg };
        }
    }

    const updateUserData = async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser({ ...user, username: data.username, profileUrl: data.profileUrl, userId: data.userId });
        } else {
            console.log("No such document!");
        }
    }

    const updateUser = async (userId, updatedData) => {
        try {
            const userRef = doc(db, 'users', userId);
            await setDoc(userRef, updatedData, { merge: true });

            setUser((prevUser) => ({
                ...prevUser,
                ...updatedData,
            }));

            return { success: true };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    };


    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            register,
            updateUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error("useAuth must be used within an AuthContextProvider")
    }
    return value;
}
