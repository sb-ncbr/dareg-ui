'use client';

import { signOut } from 'next-auth/react';
import {Button} from "@/components/ui/button";

export default function LogoutButton() {
    const handleLogout = () => {
        signOut({ callbackUrl: '/login' }); // Redirect to the login page after logout
    };

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            <p>You are logged in!</p>
            <Button color="primary" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
}