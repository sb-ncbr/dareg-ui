"use client";

import React from "react";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "unauthenticated") {
        return <p>You need to log in to view this page.</p>;
    }

    const user = session?.user;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p><strong>Name:</strong> {user?.name || "N/A"}</p>
                <p><strong>Email:</strong> {user?.email || "N/A"}</p>
                {user?.image && (
                    <div className="mt-4">
                        <img
                            src={user.image}
                            alt="Profile Picture"
                            className="h-24 w-24 rounded-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;