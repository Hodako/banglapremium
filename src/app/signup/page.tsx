
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/app/_actions/auth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";


function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.5,18.33 21.5,12.33C21.5,11.76 21.45,11.43 21.35,11.1Z"></path></svg>
  )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creating Account...' : 'Create Account'}
        </Button>
    )
}

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useFormState(signup, null);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.success,
      });
      router.push('/login');
    }
  }, [state, toast, router]);

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  }

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Fill out the form below or sign up with Google.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {state?.error?.form && (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Signup Failed</AlertTitle>
                <AlertDescription>{state.error.form}</AlertDescription>
            </Alert>
            )}
           <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                    {state?.error?.firstName && <p className="text-sm text-destructive">{state.error.firstName[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                     {state?.error?.lastName && <p className="text-sm text-destructive">{state.error.lastName[0]}</p>}
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
                 {state?.error?.email && <p className="text-sm text-destructive">{state.error.email[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
                 {state?.error?.password && <p className="text-sm text-destructive">{state.error.password[0]}</p>}
            </div>
            <SubmitButton />
          </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                </span>
                </div>
            </div>

            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                <GoogleIcon />
                Sign up with Google
            </Button>
        </CardContent>
         <CardFooter className="text-center text-sm">
            <p className="w-full">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
            </CardFooter>
      </Card>
    </div>
  );
}
