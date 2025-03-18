"use client"; // <-- Make it a Client Component

import  useAuth  from "hooks/useAuth";
import { useRouter } from "next/navigation"; // Use "next/navigation" for App Router
import { useEffect } from "react";

export default function ProtectedRoute({ children, role  }) {
    const { user, loading } = useAuth();
    console.log(".......",user,loading);
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role != role)) {
            router.push("/authentication/sign-in"); // Redirect non-admin users
        }
    }, [user, loading, router, role]);

    if (loading) return <p>Loading...</p>; // Prevent flickering

    return user?.role === role ? children : null;
}
