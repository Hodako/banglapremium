import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { format } from "date-fns";
import Link from "next/link";

async function getUserOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return orders;
}

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <div>
       <h2 className="text-2xl font-bold mb-6">My Orders</h2>
       {orders.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'PPP')}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'} className={order.status === 'Completed' ? 'bg-green-600' : ''}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">৳{Number(order.total).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
       ) : (
        <div className="text-center py-16 border rounded-lg bg-muted/50">
            <h3 className="text-xl font-semibold">No Orders Yet</h3>
            <p className="text-muted-foreground mt-2">
                You haven&apos;t placed any orders yet.
            </p>
             <Button asChild className="mt-4">
              <Link href="/products">Start Shopping</Link>
            </Button>
        </div>
       )}
    </div>
  );
}
