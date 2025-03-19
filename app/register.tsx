import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/auth/AuthContext';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { register } = useAuth();

	const handleRegister = async () => {
		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match');
			return;
		}

		if (!email || !password) {
			Alert.alert('Error', 'Please enter both email and password');
			return;
		}

		setIsLoading(true);
		try {
			const success = await register(email, password);
			if (success) {
				Alert.alert(
					'Registration Successful',
					'Your account has been created. Please check your email for verification if required, then log in.',
					[{ text: 'OK', onPress: () => router.replace('/login') }]
				);
			} else {
				Alert.alert('Registration Failed', 'Could not create your account. Please try again with a different email or password.');
			}
		} catch (error) {
			Alert.alert('Error', 'An unexpected error occurred.');
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}
		>
			<StatusBar style="light" />
			<View style={styles.header}>
				<ThemedText style={styles.title}>Create Account</ThemedText>
				<ThemedText style={styles.subtitle}>Join Concerthal today</ThemedText>
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

				<View style={styles.inputContainer}>
					<ThemedText style={styles.label}>Confirm Password</ThemedText>
					<TextInput
						style={styles.input}
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						placeholder="Confirm password"
						secureTextEntry
					/>
				</View>

				<TouchableOpacity
					style={styles.button}
					onPress={handleRegister}
					disabled={isLoading}
				>
					<ThemedText style={styles.buttonText}>
						{isLoading ? 'Creating Account...' : 'Create Account'}
					</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.secondaryButton}
					onPress={() => router.back()}
				>
					<ThemedText style={styles.secondaryButtonText}>
						Back to Login
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
	secondaryButton: {
		padding: 18,
		alignItems: 'center',
		marginTop: 15,
	},
	secondaryButtonText: {
		color: '#CCCCCC',
		fontSize: 16,
	},
});
