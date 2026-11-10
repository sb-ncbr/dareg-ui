"use client";

import React, { useRef } from "react";
// INVITE-MODE (disabled, replaced by auto-link)
// import { useState } from "react";
import { useSession } from "next-auth/react";
// INVITE-MODE (disabled, replaced by auto-link)
// import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { TypographyH2 } from "@/components/typography/typography-h2";
import {
  useApiServiceGetApiV1Profile,
  // INVITE-MODE (disabled, replaced by auto-link)
  // useApiServiceGetApiV1ProfileKey,
  // useApiServicePostApiV1ProfileOnedataLink,
} from "../../../openapi/queries";
// INVITE-MODE (disabled, replaced by auto-link)
// import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Profile } from "../../../openapi/requests";
import { DateFormater } from "@/components/date_formatter/date-formatter";
import BoundingBox from "@/components/bounding-box/bounding-box";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { useOnedataSync } from "@/hooks/use-onedata-sync";
import { useLogout } from "@/hooks/use-logout";

const cellPadding = "px-6 py-5"; // Adjust all cell paddings here

const relativeTimeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

function formatRelativeTime(isoDate: string): string {
  const seconds = Math.round((new Date(isoDate).getTime() - Date.now()) / 1000);
  for (const [unit, unitSeconds] of RELATIVE_TIME_UNITS) {
    if (Math.abs(seconds) >= unitSeconds) {
      return relativeTimeFormat.format(Math.round(seconds / unitSeconds), unit);
    }
  }
  return relativeTimeFormat.format(seconds, "second");
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { data: profileDataResponse } = useApiServiceGetApiV1Profile();

  // Move hooks to the top level before any early returns
  const tableRef = useRef<HTMLDivElement>(null);
  // INVITE-MODE (disabled, replaced by auto-link)
  // const queryClient = useQueryClient();
  // const [onedataToken, setOnedataToken] = useState("");
  //
  // const onedataLink = useApiServicePostApiV1ProfileOnedataLink({
  //   onSuccess: (data) => {
  //     setOnedataToken("");
  //     queryClient.invalidateQueries({
  //       queryKey: [useApiServiceGetApiV1ProfileKey],
  //     });
  //     if (data.failed_groups.length > 0) {
  //       toast.warning(
  //         `Onedata account linked, but ${data.failed_groups.length} group(s) could not be joined. Please try again later.`
  //       );
  //     } else {
  //       toast.success("Onedata access activated.");
  //     }
  //   },
  //   onError: () => {
  //     toast.error(
  //       "Failed to activate Onedata access. Check that the token is valid and not expired."
  //     );
  //   },
  // });

  const { sync, isSyncing } = useOnedataSync();
  const logout = useLogout();

  const handleOnedataSync = async () => {
    const genericError = "Onedata access could not be synced, please try again later.";
    const outcome = await sync({ force: true });
    if (outcome.kind !== "response") {
      toast.error(genericError);
      return;
    }
    const { body } = outcome;
    if (outcome.status !== 200) {
      toast.error(body.error ?? genericError);
    } else if (body.skipped) {
      toast.info("A Onedata sync is already running.");
    } else if (body.failed_groups.length > 0) {
      toast.warning(
        `Onedata access synced, but ${body.failed_groups.length} Onedata group(s) could not be joined: ` +
          body.failed_groups.map((group) => group.group_id).join(", ")
      );
    } else {
      toast.success("Onedata access synced.");
    }
  };

  // update() (token refresh before every Onedata sync) sets status to "loading" but keeps the session,
  // the page must stay as it is then; the sync patches only the Onedata fields of the cached profile
  if (status === "loading" && !session) {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>You need to log in to view this page.</p>;
  }

  const user = session?.user;
  const profile: Profile | undefined = profileDataResponse?.results?.[0];
  const onedataUserId = profile?.onedata_user_id;
  const onedataSyncError = profile?.onedata_last_sync_error;

  // status comes only from the profile, nothing is shown while it is loading
  let onedataStatus: React.ReactNode = null;
  if (profile?.onedata_auto_link_enabled === false) {
    onedataStatus = (
      <span>
        Automatic Onedata linking is disabled
        {onedataUserId && <> (Onedata user id <code>{onedataUserId}</code>)</>}
      </span>
    );
  } else if (profile && !onedataUserId) {
    onedataStatus = (
      <>
        <span>Not linked</span>
        {onedataSyncError && (
          <span className="text-sm text-destructive">{onedataSyncError}</span>
        )}
      </>
    );
  } else if (profile && onedataSyncError) {
    onedataStatus = (
      <span>
        Linked (Onedata user id <code>{onedataUserId}</code>), but the last sync
        had a problem: {onedataSyncError}
      </span>
    );
  } else if (profile) {
    onedataStatus = (
      <span>
        Linked (Onedata user id <code>{onedataUserId}</code>)
      </span>
    );
  }

  return (
    <div>
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <TypographyH2 text="Profile" />
        </div>
        <div className="flex items-center">
          <Button variant={"default"} onClick={logout}>
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
                      {
                        // INVITE-MODE (disabled, replaced by auto-link)
                        // <span>{profile?.onedata_user_id || "Not linked"}</span>
                        // <div className="flex gap-2">
                        //   <Input
                        //     type="password"
                        //     autoComplete="off"
                        //     placeholder="Short-lived Onedata access token"
                        //     value={onedataToken}
                        //     onChange={(e) => setOnedataToken(e.target.value)}
                        //   />
                        //   <Button
                        //     disabled={!onedataToken.trim() || onedataLink.isPending}
                        //     onClick={() =>
                        //       onedataLink.mutate({
                        //         requestBody: { token: onedataToken.trim() },
                        //       })
                        //     }
                        //   >
                        //     Activate Onedata access
                        //   </Button>
                        // </div>
                        // <span className="text-sm text-muted-foreground">
                        //   The token is used once and never stored. Activate again
                        //   after you get access to new datasets.
                        // </span>
                      }
                      {onedataStatus}
                      {profile?.onedata_last_sync_at && (
                        <span className="text-sm text-muted-foreground">
                          Last synced{" "}
                          {formatRelativeTime(profile.onedata_last_sync_at)}
                        </span>
                      )}
                      {profile?.onedata_auto_link_enabled && (
                        <div>
                          <Button
                            disabled={isSyncing}
                            onClick={handleOnedataSync}
                          >
                            {isSyncing ? "Syncing..." : "Sync Onedata access"}
                          </Button>
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground">
                        DAREG keeps your Onedata access in sync automatically
                        while you use DAREG. Use Sync only if something you were
                        given access to doesn&apos;t show up in Onedata after a
                        minute.
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
