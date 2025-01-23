"use client"

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState({ emailOrUsername: "", password: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const { login } = useUserContext();

    const handleLogin = async () => {
        // Validate inputs before submission
        if (!user.emailOrUsername || !user.password) {
            toast.error("Please enter both email/username and password");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/api/auth/login", user);

            // Store user in local storage and context
            localStorage.setItem("user", JSON.stringify(response.data.user));
            login(response.data.user);

            // Success toast and navigation
            toast.success("Login successful");
            router.push("/dashboard");
        } catch (error: AxiosError | any) {
            // Detailed error handling
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        toast.error("Invalid email/username or password");
                        break;
                    case 401:
                        toast.error("Unauthorized. Please check your credentials.");
                        break;
                    case 403:
                        toast.error("Access denied. Your account may be locked.");
                        break;
                    case 500:
                        toast.error("Server error. Please try again later.");
                        break;
                    default:
                        toast.error("An unexpected error occurred");
                }
            } else if (error.request) {
                // No response received
                toast.error("No response from server. Please check your internet connection.");
            } else {
                // Error setting up the request
                toast.error("Error processing your login request");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.emailOrUsername && user.password));
    }, [user.emailOrUsername, user.password]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 mb-6">Sign in to continue</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                            Email or Username
                        </label>
                        <input
                            id="email"
                            type="text"
                            placeholder="Enter your email or username"
                            value={user.emailOrUsername}
                            onChange={(e) => setUser({ ...user, emailOrUsername: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={buttonDisabled || loading}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out 
                            ${buttonDisabled || loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-gray-600">
                        Not registered?
                        <a
                            href="/auth/signup"
                            className="text-blue-600 hover:text-blue-800 ml-2 font-medium transition duration-300"
                        >
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}