import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApiServiceGetApiV1Profile } from '../../openapi/queries';
import type { Profile } from '../../openapi/requests'; // adjust path if needed
import { useSession } from 'next-auth/react';

const UserProfileContext = createContext<Profile | null>(null);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { data, error } = useApiServiceGetApiV1Profile();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && data?.results && data.results.length > 0) {
      setProfile(data.results[0]);
      console.log("User profile loaded:", data.results[0]);
    } else if (session) {
      console.warn("No profile found for the user.");
    }
    if (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [session, error, data]);

  return (
    <UserProfileContext.Provider value={profile}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};
