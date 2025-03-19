import { View, Image } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";

export interface Student {
	id: number;
	minutes: number;
	name: string;
	photo: string;
}

const AssignTask = () => {
	// Use useLocalSearchParams instead of route.params
	const params = useLocalSearchParams();

	console.log("Received params:", params);

	// Reconstruct the student object from URL parameters
	const student: Student = {
		id: Number(params.studentId),
		name: params.studentName as string,
		photo: params.studentPhoto as string,
		minutes: Number(params.studentMinutes)
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

			{/* Add your task assignment UI here */}
		</View>
	);
}

export default AssignTask;
