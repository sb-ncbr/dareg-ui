"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import einfraLogo from "../../../public/e-INFRA_logo_RGB_lilek.png";
import ceitecLogo from "../../../public/ceitec_logo.png";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { TypographyPGhost } from "@/components/typography/typography-p-ghost";

export default function LogInPage() {
  const handleSignIn = () => signIn("einfracz");
  console.log(process.env.NEXT_PUBLIC_AUTH_OIDC_ISSUER_ID);
  console.log(process.env.NEXT_PUBLIC_AUTH_OIDC_ISSUER);
  return (
    <Card className="w-[400px] spacing-y-12">
      <CardHeader className="">
        <Image src={ceitecLogo} alt="Logo" width={400} />
      </CardHeader>
      <CardContent className={"space-y-4 flex flex-col items-center"}>
        <TypographyH2 text="DAREG" />
        <TypographyH2Ghost text="Dataset Registry" />
      </CardContent>
      <CardFooter className="flex flex-col  justify-center">
        <TypographyPGhost text="Sign in using:" />
        <Button
          className={"mt-2 p-10"}
          variant={"outline"}
          size={"xl"}
          onClick={handleSignIn}
        >
          <Image
            src={einfraLogo}
            className={"px-4 py-2"}
            alt={"einfraLogo"}
            width={200}
          ></Image>
        </Button>
      </CardFooter>
    </Card>
  );
}
