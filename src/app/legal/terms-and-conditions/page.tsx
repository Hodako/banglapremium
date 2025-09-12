import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Digital Direct',
  description: 'Read the terms and conditions for using the Digital Direct website and services.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-headline text-4xl font-extrabold tracking-tight">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <p>Please read these terms and conditions carefully before using Our Service.</p>

          <h2>Interpretation and Definitions</h2>
          <h3>Interpretation</h3>
          <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
          <h3>Definitions</h3>
          <p>For the purposes of these Terms and Conditions:</p>
          <ul>
            <li><strong>"Company"</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Digital Direct.</li>
            <li><strong>"Service"</strong> refers to the Website.</li>
            <li><strong>"Terms and Conditions"</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
            <li><strong>"Website"</strong> refers to Digital Direct, accessible from [Your Website URL]</li>
            <li><strong>"You"</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
          </ul>

          <h2>Acknowledgment</h2>
          <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
          <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>

          <h2>Purchases</h2>
          <p>If You wish to purchase any product or service made available through the Service ("Purchase"), You may be asked to supply certain information relevant to Your Purchase including, without limitation, Your name, Your email, and payment information.</p>

          <h2>Termination</h2>
          <p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>

          <h2>Changes to These Terms and Conditions</h2>
          <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms and Conditions, You can contact us by email: support@digitaldirect.com</p>
        </CardContent>
      </Card>
    </div>
  );
}
