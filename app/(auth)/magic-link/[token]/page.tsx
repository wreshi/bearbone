"use client";

import { authCookie, authenticatedUrl } from "@/constants";
import { verifyMagicLinkAction } from "@/server/magic-link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CircleX, Loader2 } from "lucide-react";
import { cn } from "@/utils";

export default function MagicLinkPage() {
  const { execute } = useServerAction(verifyMagicLinkAction);
  const router = useRouter();
  const params = useParams<{ token: string }>();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      const token = params.token;
      if (!token) {
        setStatus("error");
        setErrorMessage("Invalid magic link");
        return;
      }

      try {
        const [data, err] = await execute({ token });
        if (err || !data.success) {
          setStatus("error");
          setErrorMessage(err?.message ?? data?.message ?? "Invalid Link");
          return;
        }
        setStatus("success");
        toast.success(data.message);
        router.push(authenticatedUrl);
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          "Something went wrong. Contact support if this issue persists.",
        );
      }
    };

    verifyToken();
  }, [execute, params.token, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-fit border-2 border-primary/10 px-8 shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          {status === "loading" && (
            <Loader2
              className="size-12 animate-spin text-primary"
              aria-hidden="true"
            />
          )}
          {status === "success" && (
            <CheckCircle
              className="text-success size-12 animate-in zoom-in"
              aria-hidden="true"
            />
          )}
          {status === "error" && (
            <CircleX
              className="size-12 text-destructive animate-in zoom-in"
              aria-hidden="true"
            />
          )}
          <CardTitle
            className={cn(
              "text-center text-2xl font-bold",
              status === "error" ? "text-destructive" : "text-primary",
            )}
          >
            {status === "loading" && "Checking your magic link..."}
            {status === "success" && "Verification successful!"}
            {status === "error" && "Verification failed."}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center duration-700 animate-in fade-in">
          {status === "loading" && (
            <p className="text-muted-foreground">
              Please wait while we verify your magic link.
            </p>
          )}
          {status === "success" && (
            <p className="text-muted-foreground">
              You'll be redirected to your account shortly.
            </p>
          )}
          {status === "error" && (
            <p className="text-destructive">{errorMessage}</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
