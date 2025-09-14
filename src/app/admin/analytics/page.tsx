import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

const salesData = [
    { name: 'Jan', revenue: 4000, orders: 240 },
    { name: 'Feb', revenue: 3000, orders: 139 },
    { name: 'Mar', revenue: 5000, orders: 980 },
    { name: 'Apr', revenue: 4500, orders: 390 },
    { name: 'May', revenue: 6000, orders: 480 },
    { name: 'Jun', revenue: 5500, orders: 380 },
    { name: 'Jul', revenue: 7000, orders: 430 },
];

const trafficData = [
  { name: 'Week 1', users: 1200 },
  { name: 'Week 2', users: 1500 },
  { name: 'Week 3', users: 1300 },
  { name: 'Week 4', users: 1800 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5" /> Sales Performance</CardTitle>
                    <CardDescription>Monthly revenue and order overview.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                            <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickFormatter={(value) => `৳${Number(value) / 1000}k`} />
                            <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                            <Bar yAxisId="right" dataKey="orders" fill="hsl(var(--secondary))" name="Orders" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

             <div className="grid gap-6 md:grid-cols-2">
                <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2"><LineChart className="h-5 w-5" /> Website Traffic</CardTitle>
                         <CardDescription>Weekly unique visitors.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trafficData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                                <YAxis stroke="#888888" fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" /> Top Categories</CardTitle>
                         <CardDescription>Sales distribution by product category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="flex justify-center items-center h-[300px]">
                            <p className="text-muted-foreground">Pie chart placeholder</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
