import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/auth/AuthContext';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			const success = await login(email, password);
			if (success) {
				router.replace('/(tabs)');
			} else {
				Alert.alert('Login Failed', 'Please check your credentials and try again.');
			}
		} catch (error) {
			Alert.alert('Error', 'An unexpected error occurred.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegister = () => {
		router.push('/register');
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}
		>
			<StatusBar style="light" />
			<View style={styles.header}>
				{/* You can add a logo here */}
				<ThemedText style={styles.title}>Concerthal</ThemedText>
				<ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
			</View>

			<View style={styles.form}>
				<View style={styles.inputContainer}>
					<ThemedText style={styles.label}>Email</ThemedText>
					<TextInput
						style={styles.input}
						value={email}
						onChangeText={setEmail}
						placeholder="your@email.com"
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>

				<View style={styles.inputContainer}>
					<ThemedText style={styles.label}>Password</ThemedText>
					<TextInput
						style={styles.input}
						value={password}
						onChangeText={setPassword}
						placeholder="Your password"
						secureTextEntry
					/>
				</View>

				<TouchableOpacity
					style={styles.button}
					onPress={handleLogin}
					disabled={isLoading}
				>
					<ThemedText style={styles.buttonText}>
						{isLoading ? 'Logging in...' : 'Log In'}
					</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={handleRegister}
					disabled={isLoading}
				>
					<ThemedText style={styles.buttonText}>
						{'Register'}
					</ThemedText>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#121212',
	},
	header: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 100,
		paddingBottom: 50,
	},
	title: {
		fontSize: 42,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 18,
		color: '#CCCCCC',
	},
	form: {
		paddingHorizontal: 30,
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		color: '#FFFFFF',
	},
	input: {
		backgroundColor: '#FFFFFF',
		borderRadius: 8,
		padding: 15,
		fontSize: 16,
	},
	button: {
		backgroundColor: '#AF4926',
		borderRadius: 8,
		padding: 18,
		alignItems: 'center',
		marginTop: 20,
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: '600',
	},
});
