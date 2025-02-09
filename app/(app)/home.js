import React, { useEffect, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { getDocs, query, where } from 'firebase/firestore';

import { useAuth } from '../../context/authContext'
import Loading from '../../components/Loading';
import ChatList from '../../components/Home/ChatList';
import { usersRef } from '../../firebaseConfig';

export default function Home() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.userId) getUsers();
    console.log("User ID:", user?.userId);
  }, [user?.userId]);

  const getUsers = async () => {
    if (!user?.userId) {
      return; // Ensure userId is defined
    }

    setLoading(true);
    try {
      const q = query(usersRef, where('userId', '!=', user.userId));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data() });
      });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View className="flex-1">
      <StatusBar style="light" />
      {
        loading ? (
          <View className="flex-1 justify-center items-center">
            <Loading size={hp(30)} />
          </View>
        ) : (
          <ChatList currentUser={user} users={users} onRefresh={getUsers} />
        )
      }
    </View>
  );
}