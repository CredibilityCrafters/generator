import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView as SafeArea } from "react-native-safe-area-context";
import { useAuth } from '@/auth/AuthContext';

const Header = () => {
	return (
		<SafeArea>
			<ThemedText style={{ fontSize: 36, lineHeight: 36, marginTop: 60, color: "#FFFFFF" }}>
				Profile
			</ThemedText>
		</SafeArea>
	);
};

export default function ProfileScreen() {
	const { currentUser, logout } = useAuth();

	// Get user info safely from user_metadata or direct properties
	const userName =
		currentUser?.user_metadata?.name ||
		currentUser?.user_metadata?.full_name ||
		'No Name';
	const userEmail = currentUser?.email || 'No Email';

	return (
		<ParallaxScrollView
			styleHeader={{
				justifyContent: "center",
				alignItems: "center",
				maxHeight: 150,
			}}
			header={<Header />}
			headerBackgroundColor={{ dark: "#AF4926", light: "#D7A492" }}
		>
			<View style={styles.container}>
				<View style={styles.profileInfo}>
					<ThemedText style={styles.name}>{userName}</ThemedText>
					<ThemedText style={styles.email}>{userEmail}</ThemedText>
				</View>

				<View style={styles.section}>
					<ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>
					{/* You can add more settings options here */}
				</View>

				<TouchableOpacity
					style={styles.logoutButton}
					onPress={logout}
				>
					<ThemedText style={styles.logoutText}>Log Out</ThemedText>
				</TouchableOpacity>
			</View>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	profileInfo: {
		marginVertical: 20,
		alignItems: 'center',
	},
	name: {
		fontSize: 24,
		fontWeight: 'bold',
		marginVertical: 5,
	},
	email: {
		fontSize: 16,
		opacity: 0.7,
	},
	section: {
		marginVertical: 20,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15,
	},
	logoutButton: {
		backgroundColor: '#AF4926',
		padding: 15,
		borderRadius: 8,
		marginTop: 30,
		alignItems: 'center',
	},
	logoutText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
});
