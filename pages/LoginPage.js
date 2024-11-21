import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Cek apakah pengguna sudah login sebelumnya
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('userEmail');
            const storedPassword = await AsyncStorage.getItem('userPassword');

            if (storedEmail && storedPassword) {
                navigation.replace('Home');
            }
        } catch (error) {
            console.error('Error checking login status', error);
        }
    };

    const handleLogin = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('userEmail');
            const storedPassword = await AsyncStorage.getItem('userPassword');

            if (email === storedEmail && password === storedPassword) {
                await AsyncStorage.setItem('isLoggedIn', 'true');
                Alert.alert('Success', 'Login successful!');
                navigation.replace('Home');
            } else {
                Alert.alert('Error', 'Invalid email or password');
            }
        } catch (error) {
            Alert.alert('Error', 'Login failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 15 },
    button: { backgroundColor: '#4a90e2', padding: 10, borderRadius: 5, width: '100%', alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { marginTop: 10, color: '#4a90e2', textDecorationLine: 'underline' },
});
