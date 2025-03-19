import { View, Image, TextInput, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";

export interface Student {
	id: number;
	minutes: number;
	name: string;
	photo: string;
}

interface setAssignmentRespone {
	answerText: string;
	minutes: number;
	succes: Boolean;
}

const AssignTask = () => {
	// Use useLocalSearchParams instead of route.params
	const params = useLocalSearchParams();
	const [loading, setLoading] = useState(false)
	const [response, setResponse] = useState<setAssignmentRespone>()
	const [text, setText] = useState<string>('');  // Initialize with empty string

	console.log("Received params:", params);

	// Reconstruct the student object from URL parameters
	const student: Student = {
		id: Number(params.studentId),
		name: params.studentName as string,
		photo: params.studentPhoto as string,
		minutes: Number(params.studentMinutes)
	};


	const setAssignment = async (payload: string) => {
		setLoading(true);
		try {
			const response = await fetch('http://127.0.0.1:8000/api/call-student', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					studentId: student.id,
					assignmentText: payload
				})
			});

			if (!response.ok) {
				throw new Error('Failed to fetch student');
			} else {
				const responseData: setAssignmentRespone = await response.json();
				setResponse(responseData);
				console.log(responseData);
			}


		} catch (error) {
			console.error('Error fetching random student:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={{ flex: 1, padding: 16, alignItems: 'center' }}>
			<Stack.Screen options={{ title: "Assign Task" }} />

			<View style={{ alignItems: 'center', marginBottom: 20, marginTop: 20 }}>
				<Image
					source={{ uri: student.photo }}
					style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
				/>
				<ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{student.name}</ThemedText>
				<ThemedText>Minutes: {student.minutes}</ThemedText>
			</View>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					value={text}
					onChangeText={setText}
					placeholder="Enter task"
					keyboardType="default"
					autoCapitalize="none"
					multiline={true}
					numberOfLines={4}
				/>

				<Pressable
					style={styles.button}
					onPress={() => setAssignment(text)}
					disabled={loading}
				>
					<ThemedText style={styles.buttonText}>
						{loading ? "Assigning..." : "Assign Task"}
					</ThemedText>
				</Pressable>

				{response && (
					<View style={styles.responseContainer}>
						<ThemedText>{response.answerText}</ThemedText>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		width: '100%',
		padding: 10,
	},
	input: {
		width: '100%',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
		backgroundColor: '#fff',
		minHeight: 100,
	},
	button: {
		backgroundColor: '#2196F3',
		padding: 12,
		borderRadius: 5,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	responseContainer: {
		marginTop: 20,
		padding: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 5,
	}
});

export default AssignTask;
