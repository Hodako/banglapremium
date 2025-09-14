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

// TODO: Fetch orders for the logged-in user from the database
const orders: any[] = [];

export default function OrdersPage() {
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
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'} className={order.status === 'Completed' ? 'bg-green-600' : ''}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">৳{order.total.toFixed(2)}</TableCell>
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
                You haven't placed any orders.
            </p>
        </div>
       )}
    </div>
  );
}
