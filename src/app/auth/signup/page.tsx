"use client"
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        username: "",
        general: ""
    });
    const [loading, setLoading] = useState(false);

    const validateField = (name: string, value: string) => {
        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(value) ? "Invalid email address" : "";
            
            case "password":
                if (value.length < 8) return "Password must be at least 8 characters";
                if (!/[A-Z]/.test(value)) return "Password needs an uppercase letter";
                if (!/[a-z]/.test(value)) return "Password needs a lowercase letter";
                if (!/[0-9]/.test(value)) return "Password needs a number";
                return "";
            
            case "username":
                if (value.length < 3) return "Username must be at least 3 characters";
                if (/\s/.test(value)) return "Username cannot contain spaces";
                return "";
            
            default:
                return "";
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
        
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error, general: "" }));
    };

    const onSignup = async () => {
        // Validate all fields
        const emailError = validateField("email", user.email);
        const passwordError = validateField("password", user.password);
        const usernameError = validateField("username", user.username);

        // Update errors
        setErrors({
            email: emailError,
            password: passwordError,
            username: usernameError,
            general: ""
        });

        // Check if any validation errors exist
        if (emailError || passwordError || usernameError) {
            toast.error("Please correct the errors before submitting");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/auth/register", user);
            toast.success("Signup successful! Please login to your account.");
            router.push("/auth/login");
        } catch (error: any) {
            let errorMessage = "Signup failed";
            
            if (error.response) {
                // Backend specific error handling
                switch (error.response.status) {
                    case 400:
                        errorMessage = error.response.data.error || "Invalid input";
                        break;
                    case 409:
                        errorMessage = "User already exists";
                        break;
                    case 500:
                        errorMessage = "Server error. Please try again later.";
                        break;
                    default:
                        errorMessage = error.response.data.message || "An error occurred";
                }
            }

            // Set general error to display in UI
            setErrors(prev => ({
                ...prev,
                general: errorMessage
            }));

            // Also show toast for additional visibility
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                    <p className="text-gray-500 mb-6">Sign up to get started</p>
                </div>

                {/* General error display */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center mb-4">
                        {errors.general}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Choose a username"
                            value={user.username}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-black transition duration-300 
                                ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-black transition duration-300 
                                ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={user.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-black transition duration-300 
                                ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-green-500'}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <button
                        onClick={onSignup}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out 
                            ${loading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            }`}
                    >
                        {loading ? "Signing up..." : "Create Account"}
                    </button>
                </div>

                <div className="text-center">
                    <Link 
                        href="/auth/login" 
                        className="text-green-600 hover:text-green-800 font-medium transition duration-300"
                    >
                        Already registered? Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
}