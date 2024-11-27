import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required');
        } else if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
        } else {
            try {
                // Simpan kredensial pengguna ke AsyncStorage
                await AsyncStorage.setItem('userEmail', email);
                await AsyncStorage.setItem('userPassword', password);

                Alert.alert('Success', 'Account created successfully!', [
                    { text: 'OK', onPress: () => navigation.replace('Login') }
                ]);
            } catch (error) {
                Alert.alert('Error', 'Failed to create account');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Already have an account? Login</Text>
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