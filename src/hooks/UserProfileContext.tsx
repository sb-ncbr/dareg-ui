import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApiServiceGetApiV1Profile } from '../../openapi/queries';
import type { Profile } from '../../openapi/requests'; // adjust path if needed

const UserProfileContext = createContext<Profile | null>(null);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { data, error } = useApiServiceGetApiV1Profile();

  useEffect(() => {
    if (data?.results && data.results.length > 0) {
      setProfile(data.results[0]);
      console.log("User profile loaded:", data.results[0]);
    }
  }, [data]);

  if (error) return <div>Error loading profile</div>;

  return (
    <UserProfileContext.Provider value={profile}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};
