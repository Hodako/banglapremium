import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers | Digital Direct',
  description: 'Join the team at Digital Direct and help us shape the future of digital commerce.',
};

const jobOpenings = [
  {
    title: 'Senior Frontend Developer',
    location: 'Remote',
    description: 'We are looking for an experienced Frontend Developer to join our team and help build the next generation of our platform.'
  },
  {
    title: 'Marketing Manager',
    location: 'Dhaka, Bangladesh',
    description: 'Drive our marketing strategy and help us reach new customers across the region.'
  },
  {
    title: 'Customer Support Specialist',
    location: 'Remote',
    description: 'Be the voice of Digital Direct and provide exceptional support to our valued customers.'
  }
];

export default function CareersPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight">Work With Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We’re always looking for passionate people to join our team.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="flex items-center gap-3 text-2xl font-bold">
          <Briefcase className="h-6 w-6 text-primary" />
          Current Openings
        </h2>
        
        {jobOpenings.length > 0 ? (
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{job.description}</p>
                  <Button className="mt-4">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">There are no open positions at the moment. Please check back later!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
