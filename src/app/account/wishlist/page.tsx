import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const wishlistItems = products.slice(0, 2); // Mock data

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 border rounded-lg bg-muted/50">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Your Wishlist is Empty</h3>
            <p className="text-muted-foreground mt-2">
                Add items you love to your wishlist to see them here.
            </p>
        </div>
      )}
    </div>
  );
}
