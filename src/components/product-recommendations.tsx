"use client";

import { useState, useEffect } from "react";
import { getProductRecommendations } from "@/ai/flows/product-recommendations";
import { products as allProducts } from "@/lib/data";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

export function ProductRecommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      try {
        // In a real app, this data would come from user sessions or a database
        const input = {
          browsingHistory: "prod_001,prod_004", // User has looked at YouTube and Spotify
          pastPurchases: "prod_005", // User has bought Netflix
          trendingProducts: allProducts
            .filter((p) => p.isBestSelling)
            .map((p) => p.id)
            .join(","),
        };

        const result = await getProductRecommendations(input);
        const recommendedIds = result.recommendedProducts.split(",").map(id => id.trim());
        
        const recommendedProducts = allProducts.filter((p) =>
          recommendedIds.includes(p.id)
        );

        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error("Failed to get product recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary"/>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl font-headline">
              Just For You
            </h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
