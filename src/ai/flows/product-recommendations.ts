// Product recommendations flow.
'use server';
/**
 * @fileOverview A product recommendation AI agent.
 *
 * - getProductRecommendations - A function that provides personalized product recommendations.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  browsingHistory: z
    .string()
    .describe('The user browsing history, as a comma separated list of product ids.'),
  pastPurchases: z
    .string()
    .describe('The user past purchases, as a comma separated list of product ids.'),
  trendingProducts: z
    .string()
    .describe('The current trending products, as a comma separated list of product ids.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .string()
    .describe('A list of recommended product ids, as a comma separated list.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an expert product recommendation system for an ecommerce website selling digital products.

Based on the user's browsing history, past purchases, and current trending products, you will provide a list of recommended product ids.

Browsing History: {{{browsingHistory}}}
Past Purchases: {{{pastPurchases}}}
Trending Products: {{{trendingProducts}}}

Recommended Products:`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
