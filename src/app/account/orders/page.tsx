
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
import { format } from "date-fns";
import Link from "next/link";


export default async function OrdersPage() {
  const orders = []; // Data will be fetched from firestore later

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
                {/* Orders will be mapped here */}
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
