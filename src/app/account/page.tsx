
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileForm } from './_components/ProfileForm';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/account');
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
      
      <ProfileForm 
        firstName={firstName}
        lastName={lastName}
        email={user.email || ''}
      />
    </div>
  );
}
