import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Story | Digital Direct',
  description: 'Learn about the history and mission of Digital Direct.',
};

export default function OurStoryPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-headline text-4xl font-extrabold tracking-tight">Our Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 text-lg text-muted-foreground">
          <div className="relative h-64 w-full overflow-hidden rounded-lg">
            <Image 
              src="https://picsum.photos/seed/team/1200/400" 
              alt="Digital Direct Team" 
              fill 
              className="object-cover" 
              data-ai-hint="diverse team working"
            />
          </div>
          <p>
            Welcome to Digital Direct, your number one source for all things digital. We're dedicated to giving you the very best of digital subscriptions, with a focus on dependability, customer service, and uniqueness.
          </p>
          <p>
            Founded in 2024 by a team of passionate tech enthusiasts, Digital Direct has come a long way from its beginnings. When we first started out, our passion for providing easier access to digital services drove us to do intense research, and gave us the impetus to turn hard work and inspiration into a booming online store. We now serve customers all over the country, and are thrilled to be a part of the fair-trade wing of the e-commerce industry.
          </p>
          <p>
            We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
          </p>
          <p className="text-right font-medium text-foreground">
            Sincerely,<br/>
            The Digital Direct Team
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
