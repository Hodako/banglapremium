'use client';

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
        <div className="flex items-center gap-6 mb-8">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;
  const nameParts = user?.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const fallback = firstName.charAt(0) + (lastName ? lastName.charAt(0) : '');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.image || `https://picsum.photos/seed/avatar/200`} alt={user?.name || ''} data-ai-hint="person portrait" />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        <div>
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={firstName} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={lastName} />
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={user?.email || ''} readOnly />
        </div>
        <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" placeholder="Enter new password" />
        </div>
        <div className="flex justify-end">
            <Button>Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
