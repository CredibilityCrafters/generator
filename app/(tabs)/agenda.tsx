import { useEffect, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView as SafeArea } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { View } from "react-native";
import ConcertData from '@/assets/data/concerts.json'

const Header = () => {
	return (
		<SafeArea>
			<ThemedText style={{ fontSize: 36, lineHeight: 36, marginTop: 60, color: "#FFFFFF" }}>
				Agenda
			</ThemedText>
		</SafeArea>
	);
};

const ConcertCard = ({ title, date, time }: { title: string, date: string, time: string }) => {
	const formattedDate = date.substring(5, 10)
	return (
		<View style={{ backgroundColor: "#f1f1f8", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, flexDirection: 'row' }}>
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<ThemedText style={{ fontWeight: 'bold' }}>{title}</ThemedText>

			</View>
			<View style={{}} >
				<ThemedText>{formattedDate}</ThemedText>
				<ThemedText>{time}</ThemedText>
			</View>

		</View>
	)
}

export default function Agenda() {
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
			{ConcertData.concerts.map((concert) => (<ConcertCard title={concert.title} date={concert.date} time={concert.time} />))}
		</ParallaxScrollView>
	);
}
