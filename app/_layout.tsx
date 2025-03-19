import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/auth/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This component handles auth-based navigation protection
function RootLayoutNav() {
	const colorScheme = useColorScheme();
	const { isAuthenticated } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		// Update inAuthGroup to include both (tabs) and (screens) folders
		const PRIVATE_ROUTES = ['(tabs)', '(screens)', 'assign-task'];
		const firstSegment = segments[0]; // e.g. 'login', '(tabs)', 'assign-task', etc.

		const isPrivate = PRIVATE_ROUTES.includes(firstSegment);

		// 1) If NOT authenticated but trying to access a private route -> go to /login
		if (!isAuthenticated && isPrivate) {
			router.replace('/login');
			return;
		}

		// 2) If authenticated but on a non-private route such as 'login' -> go to (tabs)
		//    (In other words, if you’re logged in and sitting on the login page, push them to the main app.)
		if (isAuthenticated && !isPrivate && firstSegment !== undefined) {
			// If you have public routes other than login, you might refine this logic
			// to only redirect away from certain public pages.
			router.replace('/(tabs)');
		}
	}, [isAuthenticated, segments]);

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="login" options={{ headerShown: false }} />
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="(screens)/assign-task" options={{ headerShown: true, title: "Assign Task", headerBackTitle: "Home" }} />
			</Stack>
		</ThemeProvider>
	);
}

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<AuthProvider>
			<RootLayoutNav />
		</AuthProvider>
	);
}
