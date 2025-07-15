"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import einfraLogo from "../../../public/e-INFRA_logo_RGB_lilek.png";
import ceitecLogo from "../../../public/ceitec_logo.png";
import ceitec_thumbnail from "../../../public/ceitec-thumbnail.jpg";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { TypographyH2Ghost } from "@/components/typography/typography-h2-ghost";
import { TypographyPGhost } from "@/components/typography/typography-p-ghost";
import { TypographyH3 } from "@/components/typography/typography-h3";

export default function LogInPage() {
  const handleSignIn = () => signIn("einfracz");

  return (
    <div className="flex flex-row w-full h-screen">
      {/* Left half: image */}
      <div className="relative w-2/3 h-screen overflow-hidden">
        <Image
          src={ceitec_thumbnail}
          alt="CEITEC Thumbnail"
          fill
          className="object-cover object-left w-full h-full"
          priority
        />
      </div>
      {/* Right half: seamless login area */}
      <div className="flex items-center justify-center w-1/3 h-screen bg-white z-10">
        <div className="w-full max-w-lg flex flex-col items-center space-y-12">
          <Image src={ceitecLogo} alt="Logo" width={400} />
          <div className="flex items-center space-x-2">
            <TypographyH2 text="DAREG " />
            <div className="mb-1">
              <TypographyH3 text="|" />
            </div>
            <TypographyH2Ghost text="Dataset Registry" />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <TypographyPGhost text="Sign in using:" />
            <Button
              className="p-10 on hover:bg-accent"
              variant="outline"
              size="xl"
              onClick={handleSignIn}
            >
              <Image
                src={einfraLogo}
                className="px-4 py-2"
                alt="einfraLogo"
                width={200}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
