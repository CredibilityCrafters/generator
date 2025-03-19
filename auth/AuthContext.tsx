// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from './initSupabase'; // Make sure this file exports your initialized Supabase client

// Define User type based on what we need from Supabase User
interface UserData {
	id: string;
	email?: string;
	user_metadata?: {
		name?: string;
		full_name?: string;
		avatar_url?: string;
		// Add other metadata fields as needed
	};
}

type AuthContextType = {
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	register: (email: string, password: string) => Promise<boolean>;
	logout: () => Promise<void>;
	currentUser: UserData | null;
};



export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [currentUser, setCurrentUser] = useState<UserData | null>(null);
	// Sync local state with Supabase auth session
	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange((session: any) => {
			setIsAuthenticated(!!session);
			setCurrentUser(session?.user as UserData || null);
		});

		// Check initial auth state
		const checkInitialAuth = async () => {
			const { data } = await supabase.auth.getSession();
			setIsAuthenticated(!!data.session);
			setCurrentUser(data.session?.user as UserData || null);
		};
		checkInitialAuth();

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		// For Supabase v2, use signInWithPassword; for older versions, use signIn
		const { error, data } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error("Login error:", error.message);
			return false;
		}
		setIsAuthenticated(true);
		setCurrentUser(data.user as UserData);
		return true;
	};

	const register = async (email: string, password: string): Promise<boolean> => {
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) {
				console.error("Registration error:", error.message);
				return false;
			}

			// For email confirmation flows, you might want to show a different message
			// but for this implementation, we'll consider it a success if no error occurred
			if (data.user) {
				setCurrentUser(data.user as UserData);
			}
			return true;
		} catch (error) {
			console.error('Registration error:', error);
			return false;
		}
	};

	const logout = async (): Promise<void> => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Logout error:", error.message);
		} else {
			setIsAuthenticated(false);
			setCurrentUser(null);
		}
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, register, logout, currentUser }}>
			{children}
		</AuthContext.Provider>
	);
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};