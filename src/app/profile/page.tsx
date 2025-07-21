"use client";

import React, { useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { useApiServiceGetApiV1Profile } from "../../../openapi/queries";
import Image from "next/image";
import { Profile } from "../../../openapi/requests";
import { DateFormater } from "@/components/date_formatter/date-formatter";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";

const cellPadding = "px-6 py-5"; // Adjust all cell paddings here

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { data: profileDataResponse } = useApiServiceGetApiV1Profile();

  // Move hooks to the top level before any early returns
  const tableRef = useRef<HTMLDivElement>(null);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>You need to log in to view this page.</p>;
  }

  const user = session?.user;
  const profile: Profile | undefined = profileDataResponse?.results?.[0];

  return (
    <div>
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <TypographyH2 text="Profile" />
        </div>
        <div className="flex items-center">
          <Button variant={"default"} onClick={() => signOut()}>
            <div className="flex items-center">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </div>
          </Button>
        </div>
      </div>
      <div className="flex items-start mb-6 gap-8">
        {profile?.avatar && (
            <div className="flex justify-center items-center mt-12">
              <Image
              width={256}
              height={256}
              src={profile?.avatar || "user.image"}
              alt="Profile Picture"
              className="rounded-full object-cover"
              blurDataURL={profile?.avatar+"?s=10"}
              placeholder="blur"
              style={{
                minWidth: 48,
                minHeight: 48,
                maxWidth: 256,
                maxHeight: 256,
              }}
              />
            </div>
        )}
        <BoundingBox>
          <div className="rounded-lg bg-white shadow flex-1" ref={tableRef}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={cellPadding}>Name</TableCell>
                  <TableCell className={cellPadding}>
                    {user?.name || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cellPadding}>Organization</TableCell>
                  <TableCell className={cellPadding}>
                    Masaryk University
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cellPadding}>E-mail</TableCell>
                  <TableCell className={cellPadding}>
                    {user?.email || "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cellPadding}>Last login</TableCell>
                  <TableCell className={cellPadding}>
                    <DateFormater dateString={profile?.last_login ?? ""} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cellPadding}>Logged in as</TableCell>
                  <TableCell className={cellPadding}>
                    {user?.email || "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </BoundingBox>
      </div>
    </div>
  );
};

export default ProfilePage;
