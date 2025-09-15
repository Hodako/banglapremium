'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from '@/app/admin/_actions/users';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

interface ProfileFormProps {
    firstName: string;
    lastName: string;
    email: string;
}

export function ProfileForm({ firstName, lastName, email }: ProfileFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(updateUserProfile, null);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.success,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
        {state?.error?.form && (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Update Failed</AlertTitle>
                <AlertDescription>{state.error.form}</AlertDescription>
            </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" defaultValue={firstName} />
                {state?.error?.firstName && <p className="text-destructive text-sm">{state.error.firstName}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" defaultValue={lastName} />
                 {state?.error?.lastName && <p className="text-destructive text-sm">{state.error.lastName}</p>}
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={email} readOnly />
        </div>
        <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" placeholder="Enter new password" disabled />
            <p className="text-xs text-muted-foreground">Password changes are not yet supported.</p>
        </div>
        <div className="flex justify-end">
            <SubmitButton />
        </div>
      </form>
  );
}
