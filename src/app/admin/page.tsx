import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  Users,
  Package,
  Activity,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Order, User } from "@/lib/types";

async function getDashboardData() {
    const productsQuery = collection(firestore, "products");
    const usersQuery = collection(firestore, "users");
    const ordersQuery = collection(firestore, "orders");

    const [productsSnapshot, usersSnapshot, ordersSnapshot] = await Promise.all([
        getDocs(productsQuery),
        getDocs(usersQuery),
        getDocs(ordersQuery)
    ]);

    const totalProducts = productsSnapshot.size;
    const totalCustomers = usersSnapshot.size;
    const totalOrders = ordersSnapshot.size;
    const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);

    const recentOrders = ordersSnapshot.docs
        .sort((a, b) => b.data().createdAt.toDate() - a.data().createdAt.toDate())
        .slice(0, 5)
        .map(doc => ({ id: doc.id, ...doc.data() } as Order));


    return { totalProducts, totalCustomers, totalOrders, totalRevenue, recentOrders };
}


// This is a placeholder. In a real app, you would fetch this data from your backend.
const salesData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
];

export default async function AdminDashboardPage() {
    const dashboardData = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{Number(dashboardData.totalRevenue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{dashboardData.totalOrders} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{dashboardData.totalOrders}</div>
             <p className="text-xs text-muted-foreground">From all time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{dashboardData.totalCustomers}</div>
             <p className="text-xs text-muted-foreground">Live data from Firestore</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalProducts}</div>
             <p className="text-xs text-muted-foreground">In your inventory</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>A summary of sales over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${Number(value) / 1000}k`} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              A list of the 5 most recent orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentOrders.length > 0 ? (
                <div className="space-y-4">
                    {dashboardData.recentOrders.map(order => (
                        <div key={order.id} className="flex items-center">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">{order.userId}</p>
                                <p className="text-sm text-muted-foreground">{order.transactionId}</p>
                            </div>
                             <div className="ml-auto font-medium">৳{order.total.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-8 text-muted-foreground">
                    No recent orders found.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
