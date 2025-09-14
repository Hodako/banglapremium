import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage your store's general information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input id="store-name" defaultValue="Bangla Premium" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-email">Support Email</Label>
            <Input id="store-email" type="email" defaultValue="support@banglapremium.com" />
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="store-open" defaultChecked />
            <Label htmlFor="store-open">Store is open for purchases</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>Configure your payment gateway options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="bkash-number">bKash Merchant Number</Label>
            <Input id="bkash-number" placeholder="e.g., 01234567890" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="nagad-number">Nagad Merchant Number</Label>
            <Input id="nagad-number" placeholder="e.g., 01234567890" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
