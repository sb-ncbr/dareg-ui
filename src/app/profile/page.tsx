"use client";

import React from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { useApiServiceGetApiV1ProfileById } from "../../../openapi/queries";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { data: profile, isLoading } = useApiServiceGetApiV1ProfileById({
    id: session?.user?.id ?? "",
  });
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>You need to log in to view this page.</p>;
  }

  console.log("Session Data", session);
  console.log("User Data", profile);

  const user = session?.user;

  const profileData = [
    { label: "Name", value: user?.name || "N/A" },
    { label: "Organization", value: "Masaryk University" },
    { label: "E-mail", value: user?.email || "N/A" },
    { label: "Last login", value: profile?.last_login || "N/A" },
    { label: "Logged in as", value: user?.email || "N/A" },
  ];

  return (
    <div className="container mx-auto p-6">
      <TypographyH2 text="Profile"></TypographyH2>
      <div className="flex items-center mb-6">
        {user?.image && (
          <div className="mt-8 flex justify-center">
            <Image
              src={profile?.avatar || "user.image"}
              alt="Profile Picture"
              className="h-24 w-24 rounded-full"
            />
          </div>
        )}
        <div className="rounded-lg p-6 bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profileData.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
