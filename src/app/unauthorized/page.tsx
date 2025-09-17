import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-8">
            <Card className="w-full max-w-md text-center shadow-lg">
                <CardHeader className="items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <ShieldAlert className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="mt-4 text-2xl font-bold">Access Denied</CardTitle>
                    <CardDescription>You do not have permission to view this page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6 text-muted-foreground">
                        This area is restricted. If you believe this is an error, please contact support.
                    </p>
                    <Button asChild>
                        <Link href="/">Go to Homepage</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
