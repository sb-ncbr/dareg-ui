"use client";

import React, { useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import {
  useApiServiceGetApiV1Profile,
  useApiServiceGetApiV1ProfileKey,
  useApiServicePostApiV1ProfileOnedataLink,
} from "../../../openapi/queries";
import { Input } from "@/components/ui/input";
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
  const queryClient = useQueryClient();
  const [onedataToken, setOnedataToken] = useState("");

  const onedataLink = useApiServicePostApiV1ProfileOnedataLink({
    onSuccess: (data) => {
      setOnedataToken("");
      queryClient.invalidateQueries({
        queryKey: [useApiServiceGetApiV1ProfileKey],
      });
      if (data.failed_groups.length > 0) {
        toast.warning(
          `Onedata account linked, but ${data.failed_groups.length} group(s) could not be joined. Please try again later.`
        );
      } else {
        toast.success("Onedata access activated.");
      }
    },
    onError: () => {
      toast.error(
        "Failed to activate Onedata access. Check that the token is valid and not expired."
      );
    },
  });

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
          <div
            className="flex-1 rounded-lg bg-card text-card-foreground shadow"
            ref={tableRef}
          >
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
                <TableRow>
                  <TableCell className={cellPadding}>Onedata account</TableCell>
                  <TableCell className={cellPadding}>
                    <div className="flex flex-col gap-2">
                      <span>{profile?.onedata_user_id || "Not linked"}</span>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          autoComplete="off"
                          placeholder="Short-lived Onedata access token"
                          value={onedataToken}
                          onChange={(e) => setOnedataToken(e.target.value)}
                        />
                        <Button
                          disabled={!onedataToken.trim() || onedataLink.isPending}
                          onClick={() =>
                            onedataLink.mutate({
                              requestBody: { token: onedataToken.trim() },
                            })
                          }
                        >
                          Activate Onedata access
                        </Button>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        The token is used once and never stored. Activate again
                        after you get access to new datasets.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </BoundingBox>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
