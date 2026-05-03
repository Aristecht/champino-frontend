import { Button } from "@/components/common/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/Card";
import Link from "next/link";
import { PropsWithChildren } from "react";
import Image from "next/image";

interface AuthWrapperProps {
  heading: string;
  backButtonLabel?: string;
  backButtonHref?: string;
}

export function AuthWrapper({
  children,
  heading,
  backButtonHref,
  backButtonLabel,
}: PropsWithChildren<AuthWrapperProps>) {
  return (
    <div className="flex h-full items-center justify-center px-4 py-6 sm:px-6">
      <Card className="w-full max-w-md sm:w-124">
        <CardHeader className="mb-4 flex flex-row items-center justify-center gap-3">
          <Image
            src="/images/logotype.png"
            alt="logo"
            width={40}
            height={40}
            className="shrink-0"
          />{" "}
          <CardTitle>{heading}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          {backButtonHref && backButtonLabel && (
            <Button size={"sm"} variant={"link"} className="mx-auto p-2">
              <Link href={backButtonHref}>{backButtonLabel}</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
