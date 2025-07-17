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
    <div className="flex flex-col min-h-screen w-full lg:flex-row">
      <div className="hidden lg:block relative w-0 xl:w-2/3 h-screen transition-all duration-250">
        <Image
          src={ceitec_thumbnail}
          alt="CEITEC Thumbnail"
          fill
          className="object-cover object-left w-full h-full dark:brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>
      <div className="flex items-center justify-center w-full lg:w-full xl:w-1/3 h-full min-h-screen z-10 relative">
        <div className="absolute inset-0 xl:hidden block">
          <Image
            src={ceitec_thumbnail}
            alt="CEITEC Thumbnail"
            fill
            className="object-cover object-left w-full h-full dark:brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
        </div>
        <div className="w-full max-w-lg flex flex-col items-center space-y-12 bg-white dark:bg-black/100 xl:dark:bg-white/10 py-25 rounded-lg z-10 mx-4 my-8 shadow-lg relative">
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
              className="p-10 on hover:bg-accent hover:cursor-pointer dark:bg-white/10 dark:hover:bg-white/20"
              variant="outline"
              size="xl"
              onClick={handleSignIn}
            >
              <Image
                src={einfraLogo}
                loading="eager"
                priority
                className="px-4 py-2 dark:grayscale-100 dark:brightness-1000"
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
