"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { magicLinkAuthSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import { authenticateWithMagicLinkAction } from "@/server/magic-link";
import { useRouter } from "next/navigation";
import { afterSignUpUrl } from "@/constants";

export const SignUpForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { execute, isPending, error } = useServerAction(
    authenticateWithMagicLinkAction,
  );

  const form = useForm<z.infer<typeof magicLinkAuthSchema>>({
    resolver: zodResolver(magicLinkAuthSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (formData: z.infer<typeof magicLinkAuthSchema>) => {
    setIsSubmitting(true);
    const [data, err] = await execute(formData);

    if (err) {
      toast.error(err.message);
      setIsSubmitting(false);
      return;
    }
    router.prefetch(afterSignUpUrl);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(afterSignUpUrl);
      form.reset();
    }, 300);
  };

  return (
    <div className="flex min-h-screen max-w-sm items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Create your account
          </CardTitle>
          <CardDescription>
            Please provide an email address to signup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        autoComplete="email"
                        className="min-w-72"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign up with email
              </Button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-gray-500">or</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.866 c-3.431,0.635-6.862-1.865-7.19-5.339c-0.34-3.595,2.479-6.62,6.005-6.62c1.002,0,1.946,0.246,2.777,0.679 c0.757,0.395,1.683,0.236,2.286-0.368l0,0c0.954-0.954,0.701-2.563-0.498-3.179c-1.678-0.862-3.631-1.264-5.692-1.038 c-4.583,0.502-8.31,4.226-8.812,8.809C1.945,16.9,6.649,22,12.545,22c6.368,0,8.972-4.515,9.499-8.398 c0.242-1.78-1.182-3.352-2.978-3.354l-4.61-0.006C13.401,10.24,12.545,11.095,12.545,12.151z"></path>
                </svg>
                Continue with Google
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
