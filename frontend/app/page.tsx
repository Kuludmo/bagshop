'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Shield, Truck, Loader2 } from 'lucide-react';
import { bagsApi } from '@/lib/api';
import { BagCard } from '@/components/bag-card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import type { Bag } from '@/lib/types';

const categories = [
  { name: 'Handbags', slug: 'handbag', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop' },
  { name: 'Backpacks', slug: 'backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
  { name: 'Tote Bags', slug: 'tote', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop' },
  { name: 'Crossbody', slug: 'crossbody', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
];

const features = [
  {
    icon: ShoppingBag,
    title: 'Premium Quality',
    description: 'Handcrafted bags made from the finest materials',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free delivery on all orders over $100',
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Your data is protected with enterprise security',
  },
];

export default function HomePage() {
  const [featuredBags, setFeaturedBags] = useState<Bag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBags = async () => {
      try {
        const response = await bagsApi.getAll({ limit: 4, sort: '-createdAt' });
        setFeaturedBags(response.data || []);
      } catch (error) {
        console.error('Failed to fetch featured bags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedBags();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
                  Discover Your Perfect
                  <span className="text-accent block">Bag Collection</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                  Explore our curated selection of premium bags. From elegant handbags to practical backpacks, find the perfect companion for every occasion.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/bags">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/bags?category=handbag">View Handbags</Link>
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop"
                    alt="Premium leather bag"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-xl overflow-hidden shadow-xl border-4 border-background">
                  <Image
                    src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200&h=200&fit=crop"
                    alt="Designer bag"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Shop by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse our collection organized by style and function
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/bags?category=${category.slug}`}
                  className="group relative aspect-square rounded-xl overflow-hidden"
                >
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">New Arrivals</h2>
                <p className="text-muted-foreground">Check out our latest additions</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/bags">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : featuredBags.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredBags.map((bag) => (
                  <BagCard key={bag._id} bag={bag} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bags available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-balance">
              Ready to Find Your Perfect Bag?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who have found their ideal bags with us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/bags">Browse Collection</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
