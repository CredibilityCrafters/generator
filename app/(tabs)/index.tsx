import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Image, View, Pressable, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { router } from "expo-router";

const HeaderImage = () => {
	const { currentUser } = useAuth();
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "flex-start",
				padding: 16,
				marginTop: 101,
			}}
		>
			{/* Echo Text */}
			<View style={{ marginLeft: 22 }}>
				<ThemedText style={{ fontSize: 30, lineHeight: 30, color: "white" }}>
					{currentUser?.email}
				</ThemedText>
			</View>
		</View>
	);
};

interface StudentResponse {
	success: boolean;
	student: {
		id: number;
		naam: string;
		foto: string;
		minuten: number;
	}
}

interface Student {
	id: number;
	name: string;
	photo: string;
	minutes: number;
}

const RandomStudent = () => {
	const [student, setStudent] = useState<Student | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchRandomStudent = async () => {
		setLoading(true);
		try {
			const response = await fetch('http://127.0.0.1:8000/api/search-student', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					competitionNumber: "221323"
				})
			});

			if (!response.ok) {
				throw new Error('Failed to fetch student');
			}

			const data: StudentResponse = await response.json();

			if (data.success && data.student) {
				// Transform the data to match our Student interface
				setStudent({
					id: data.student.id,
					name: data.student.naam,
					// Construct full URL for the photo
					photo: `http://127.0.0.1:8000${data.student.foto}`,
					minutes: data.student.minuten
				});
			}
		} catch (error) {
			console.error('Error fetching random student:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={{ padding: 16 }}>


			{loading && (
				<View style={{ alignItems: 'center', padding: 20 }}>
					<ActivityIndicator color="#AF4926" size="large" />
				</View>
			)}

			{student && (
				<View style={{ marginTop: 16, alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
					<Image
						source={{ uri: student.photo }}
						style={{ width: 100, height: 100, borderRadius: 50 }}
					/>
					<ThemedText style={{ fontSize: 18, marginTop: 8, fontWeight: 'bold' }}>{student.name}</ThemedText>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 12 }}>
						<ThemedText>Minutes: {student.minutes}</ThemedText>
					</View>

					<Pressable
						onPress={() => {
							// Navigate to the screens path with proper params
							router.push({
								pathname: "/assign-task",
								params: {
									studentId: student.id,
									studentName: student.name,
									studentPhoto: student.photo,
									studentMinutes: student.minutes
								}
							});
						}}
						style={{
							backgroundColor: '#4285F4',
							padding: 12,
							borderRadius: 8,
							alignItems: 'center',
							width: '100%',
						}}
					>
						<ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
							Assign Task
						</ThemedText>
					</Pressable>
				</View>
			)}
			<Pressable
				onPress={fetchRandomStudent}
				style={{
					backgroundColor: '#AF4926',
					padding: 12,
					borderRadius: 8,
					alignItems: 'center',
					marginBottom: 20,
				}}
			>
				<ThemedText style={{ color: 'white', fontWeight: 'bold', justifyContent: 'flex-end' }}>
					Find Random Student
				</ThemedText>
			</Pressable>
		</View>
	);
}

export default function HomeScreen() {
	return (
		<ParallaxScrollView
			headerBackgroundColor={{ dark: "#AF4926", light: "#D7A492" }}
			header={<HeaderImage />}
			styleHeader={{ maxHeight: 213 }}
		>
			<RandomStudent />
		</ParallaxScrollView>
	);
}
