import { useEffect, useState } from "react";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch("/api/getCookie");
                const data = await response.json();
                if (response.ok) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
            setLoading(false);
        }

        fetchUser();
    }, []);

    return { user, loading };
}
