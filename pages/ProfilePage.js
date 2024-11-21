import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        joinDate: '',
        profileImage: 'https://via.placeholder.com/150'
    });

    // Fungsi untuk memuat data pengguna
    const loadUserData = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('userEmail');
            const storedName = await AsyncStorage.getItem('userName');

            // Gunakan tanggal saat ini sebagai tanggal bergabung jika belum ada
            const joinDate = new Date().toLocaleDateString();

            setUserData({
                email: storedEmail || 'email@example.com',
                name: storedName || 'Pengguna',
                joinDate: joinDate,
                profileImage: 'https://via.placeholder.com/150'
            });
        } catch (error) {
            console.error('Error loading user data', error);
        }
    };

    // Fungsi logout
    const handleLogout = async () => {
        Alert.alert('Logout', 'Apakah Anda yakin ingin keluar?', [
            {
                text: 'Batal',
                style: 'cancel'
            },
            {
                text: 'Logout',
                onPress: async () => {
                    try {
                        // Hapus status login
                        await AsyncStorage.removeItem('isLoggedIn');
                        await AsyncStorage.removeItem('userEmail');

                        // Navigasi kembali ke halaman login
                        navigation.replace('Login');
                    } catch (error) {
                        console.error('Logout error', error);
                    }
                }
            },
        ]);
    };

    // Muat data pengguna saat komponen di-render
    useEffect(() => {
        loadUserData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* Profil Pengguna */}
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: userData.profileImage }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{userData.name}</Text>
                <Text style={styles.email}>{userData.email}</Text>
                <Text style={styles.joinDate}>Bergabung sejak: {userData.joinDate}</Text>

            </View>

            {/* Tombol Logout */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            {/* Informasi Aplikasi */}
            <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Tentang Aplikasi</Text>
                <Text style={styles.aboutText}>
                    "Cook It" adalah aplikasi yang membantu Anda menemukan
                    resep-resep masakan terbaik dari seluruh dunia dengan mudah.
                </Text>

                <View style={styles.appInfoContainer}>
                    <Text style={styles.appInfoLabel}>Versi Aplikasi:</Text>
                    <Text style={styles.appInfoText}>v1.0.0</Text>

                    <Text style={styles.appInfoLabel}>Developer:</Text>
                    <Text style={styles.appInfoText}>Tim Cook It</Text>

                    <Text style={styles.appInfoLabel}>Kontak:</Text>
                    <Text style={styles.appInfoText}>support@cookit.com</Text>
                </View>

                <Text style={styles.copyrightText}>
                    © 2024 Cook It. All rights reserved.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f8fa'
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 15
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5
    },
    joinDate: {
        fontSize: 14,
        color: '#888',
        marginBottom: 15
    },
    editProfileButton: {
        backgroundColor: '#4a90e2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 10
    },
    editProfileText: {
        color: 'white',
        fontWeight: 'bold'
    },
    logoutButton: {
        backgroundColor: '#f44336',
        padding: 15,
        margin: 20,
        borderRadius: 5,
        alignItems: 'center'
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    aboutSection: {
        padding: 20,
        backgroundColor: 'white',
        marginTop: 10
    },
    aboutTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333'
    },
    aboutText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        lineHeight: 24
    },
    appInfoContainer: {
        marginTop: 10
    },
    appInfoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5
    },
    appInfoText: {
        fontSize: 15,
        color: '#666',
        marginBottom: 5
    },
    copyrightText: {
        marginTop: 15,
        textAlign: 'center',
        color: '#888',
        fontSize: 12
    }
});