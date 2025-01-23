"use client"

import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";



export default function Home() {
  const { user } = useUserContext();
  const router = useRouter()



  if (user) router.push('/dashboard');

  // Redirect to login page if not logged in
  return router.push('/auth/login');
}
