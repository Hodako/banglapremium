
import { ReactNode } from "react";
import Link from "next/link";
import { User, Package, Heart, LogOut, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "/account", label: "Profile", icon: User },
    { href: "/account/orders", label: "My Orders", icon: Package },
    { href: "/account/track-order", label: "Track Order", icon: MapPin },
    { href: "#", label: "Wishlist", icon: Heart },
    { href: "/login", label: "Sign Out", icon: LogOut },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-8 md:text-left text-center">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="col-span-1">
          <Card>
            <CardContent className="p-2">
                <nav className="flex flex-row md:flex-col md:space-y-1 overflow-x-auto md:overflow-x-visible">
                    {navItems.map(item => (
                         <Button key={item.label} variant="ghost" className="justify-start flex-shrink-0" asChild>
                            <Link href={item.href} className="flex items-center gap-3 p-2 rounded-md transition-colors">
                            <item.icon className="w-5 h-5 text-muted-foreground" />
                            <span className="hidden sm:inline">{item.label}</span>
                            </Link>
                         </Button>
                    ))}
                </nav>
            </CardContent>
          </Card>
        </aside>
        <main className="col-span-3">
            <Card>
                <CardContent className="p-6">
                    {children}
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
