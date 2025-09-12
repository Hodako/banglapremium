'use client';

import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

// export const metadata: Metadata = {
//   title: 'Contact Us | Digital Direct',
//   description: 'Get in touch with the Digital Direct team.',
// };

export default function ContactUsPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: 'Message Sent!',
      description: "Thanks for reaching out. We'll get back to you soon.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
       <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We'd love to hear from you.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                        <h3 className="font-semibold text-foreground">Our Office</h3>
                        <p>123 Digital Avenue, Gulshan, Dhaka-1212, Bangladesh</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                        <h3 className="font-semibold text-foreground">Email Us</h3>
                        <p>support@digitaldirect.com</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                        <h3 className="font-semibold text-foreground">Call Us</h3>
                        <p>+880 1234 567890</p>
                    </div>
                </div>
            </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g., Order Inquiry" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message..." required rows={5} />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
