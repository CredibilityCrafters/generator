import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
	header: ReactElement;
	stickyHeader?: () => ReactElement;
	headerBackgroundColor: { dark: string; light: string };
	styleBody?: ViewStyle;
	styleHeader?: ViewStyle;
	styleStickyHeader?: ViewStyle;

}>;

export default function ParallaxScrollView({
	children,
	header,
	stickyHeader,
	headerBackgroundColor,
	styleBody,
	styleHeader,
	styleStickyHeader
}: Props) {
	const colorScheme = useColorScheme() ?? "light";
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const bottom = useBottomTabOverflow();
	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[2, 1, 1]
					),
				},
			],
		};
	});

	return (
		<ThemedView style={styles.container}>
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				scrollIndicatorInsets={{ bottom }}
				contentContainerStyle={{ paddingBottom: bottom }}
			>
				<Animated.View
					style={[
						styles.header,
						{ backgroundColor: headerBackgroundColor[colorScheme] },
						headerAnimatedStyle,
						styleHeader,
					]}
				>
					{header}
				</Animated.View>
				<ThemedView style={[styles.content, styleBody]}>{children}</ThemedView>
			</Animated.ScrollView>
			{stickyHeader && <Animated.View style={styleStickyHeader} >{stickyHeader()}</Animated.View>}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		height: HEADER_HEIGHT,
		overflow: "hidden",
	},
	stickyHeader: {
		height: HEADER_HEIGHT
	},
	content: {
		flex: 1,
		padding: 32,
		gap: 16,
		overflow: "hidden",
	},
});
