 
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, db } from '@/config/config';
import { doc, getDoc } from 'firebase/firestore';

export default function Profile() {
    const [userData, setUserData] = useState({
        email: "",
        fullName: "",
        departement: "",
        role: "",
    });
    
    useEffect(() => {
        async function loadUserData() {
            const uid = auth.currentUser?.uid;
            
            if (!uid) {
                console.log("Utilisateur non connecté");
                return;
            }
            
            const userRef = doc(db, "Users", uid);
            
            try {
                const docSnapshot = await getDoc(userRef);
                
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setUserData({
                        email: data.email || "",
                        fullName: data.fullName || "",
                        departement: data.departement || "",
                        role: data.role || "",

                    });
                }
            } catch (error) {
                console.log("Erreur:", error);
            }
        }
        
        loadUserData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mon Profil</Text>
            
            <View style={styles.infoBox}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userData.email}</Text>
            </View>
            
            <View style={styles.infoBox}>
                <Text style={styles.label}>Nom:</Text>
                <Text style={styles.value}>{userData.fullName}</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.label}>Rôle:</Text>
                <Text style={styles.value}>{userData.role}</Text>
            </View>
            
            <View style={styles.infoBox}>
                <Text style={styles.label}>Département:</Text>
                <Text style={styles.value}>{userData.departement}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },
    infoBox: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5
    },
    label: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5
    },
    value: {
        fontSize: 18,
        fontWeight: "500"
    }
});