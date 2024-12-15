"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeftIcon, Loader } from "lucide-react";
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
import { PasswordField } from "@/components/ui/password-input";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/auth.schema";
import { signUpAction } from "@/server/sign-up";
import { useServerAction } from "zsa-react";

export const SignUpForm = () => {
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { execute, isPending, error } = useServerAction(signUpAction);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const nextStep = async () => {
    const valid = await form.trigger("email");
    if (!valid) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setFormStep(1);
      setIsSubmitting(false);
    }, 250);
  };

  const onSubmit = async (formData: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    const [data, err] = await execute(formData);

    if (err) {
      toast.error(err.message);
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    form.reset();
  };

  return (
    <div className="flex min-h-screen max-w-sm items-center justify-center">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {formStep === 0 ? "Create your account" : "Set your password"}
          </CardTitle>
          <CardDescription>
            {formStep === 0
              ? "Please provide an email address to signup."
              : "Choose a strong password to secure your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {formStep === 0 ? (
                <>
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            autoComplete="email"
                            className="min-w-80"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={nextStep}
                  >
                    {isSubmitting ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Continue with email
                  </Button>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">or</span>
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
                </>
              ) : (
                <>
                  <PasswordField placeholder="Enter your password" />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create account
                  </Button>
                  {/* <Button
                      type="button"
                      variant="ghost"
                      className="w-full underline-offset-4 hover:underline"
                      onClick={() => setFormStep(0)}
                    >
                      <ArrowLeftIcon className="mr-2 h-4 w-4" />
                      Back to home
                    </Button> */}
                </>
              )}
            </form>
          </Form>
          {formStep === 0 && (
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <a href="/login" className="text-primary hover:underline">
                Login
              </a>
            </div>
          )}
          {/* <p className="mt-4 text-center text-xs text-gray-400">
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-primary/70 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary/70 hover:underline">
              Privacy Policy
            </a>
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
};
