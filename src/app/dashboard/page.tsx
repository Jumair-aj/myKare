"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";

function Page() {
    const router = useRouter();
    const { user, logout } = useUserContext();
    const [users, setUsers] = useState([]);

    const handleLogout = async () => {
        try {
            await axios.get("/api/auth/logout");
            logout();
            toast.success("Logged out successfully");
            router.push("/auth/login");
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("An error occurred during logout");
        }
    };

    const getAllUsers = async () => {
        try {
            const response = await axios.get("/api/getAllUsers");
            return response.data.users;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    };

    useEffect(() => {
        if (user?.isAdmin) {
            getAllUsers().then((res) => setUsers(res));
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center  p-6">
            <div className="w-full h-full bg-white shadow-lg rounded-xl p-8 space-y-6">
                <div className="text-center">
                    <div className="flex justify-between">
                        <div className=""></div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome {user?.username}</h1>
                        <button
                            onClick={handleLogout}
                            className=" bg-red-500 px-5 text-white py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 ease-in-out shadow-md"
                        >
                            Logout
                        </button>

                    </div>
                    <hr className="border-gray-200 my-4" />
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">User Details</h2>
                        <p className="text-gray-600">Username: {user?.username}</p>
                        <p className="text-gray-600">Email: {user?.email}</p>
                    </div>

                    {user?.isAdmin && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Registered Users</h2>
                            <div className="space-y-2">
                                {users.map((u: any, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-gray-200 p-3 rounded-md shadow-sm"
                                    >
                                        <p className="text-gray-700">User: {u.username}</p>
                                        <p className="text-gray-600">Email: {u.email}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}

export default Page;