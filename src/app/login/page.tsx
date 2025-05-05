'use client';
import { signIn } from "next-auth/react";
import Image from "next/image";
import einfraLogo from "../../../public/e-INFRA_logo_RGB_lilek.png";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function LogInPage() {
    const handleSignIn = () => signIn('einfracz');
    console.log(process.env.NEXT_PUBLIC_AUTH_OIDC_ISSUER_ID)
    console.log((process.env.NEXT_PUBLIC_AUTH_OIDC_ISSUER))
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Log in</CardTitle>
                <CardDescription>Accesss all data in one place</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Welcome to CEITEC facility managment</Label>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <div>Login using:</div>

                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button variant={"outline"} size={"xl"} onClick={handleSignIn}>
                <Image src={einfraLogo} className={"px-4 py-2"} alt={"einfraLogo"} width={200}></Image>
                </Button>
            </CardFooter>
        </Card>

    );
}
