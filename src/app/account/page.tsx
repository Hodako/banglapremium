import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://picsum.photos/seed/avatar/200" alt="User avatar" data-ai-hint="person portrait" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
            <h3 className="text-xl font-semibold">John Doe</h3>
            <p className="text-muted-foreground">john.doe@example.com</p>
        </div>
      </div>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
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
