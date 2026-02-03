'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Package, Tag, Clock } from 'lucide-react';
import { bagsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Bag } from '@/lib/types';

interface BagDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BagDetailPage({ params }: BagDetailPageProps) {
  const resolvedParams = use(params);
  const [bag, setBag] = useState<Bag | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBag = async () => {
      try {
        const response = await bagsApi.getOne(resolvedParams.id);
        if (response.data) {
          setBag(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bag');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBag();
  }, [resolvedParams.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const categoryLabels: Record<string, string> = {
    handbag: 'Handbag',
    backpack: 'Backpack',
    crossbody: 'Crossbody',
    tote: 'Tote',
    clutch: 'Clutch',
    messenger: 'Messenger',
    duffel: 'Duffel',
    laptop: 'Laptop Bag',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !bag) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Bag Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The bag you are looking for does not exist.'}</p>
          <Button asChild>
            <Link href="/bags">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bags
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/bags">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bags
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
          <Image
            src={bag.image || "/placeholder.svg"}
            alt={bag.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {bag.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg py-2 px-4">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-3">
              {categoryLabels[bag.category] || bag.category}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
              {bag.name}
            </h1>
            <p className="text-3xl font-bold text-accent">
              {formatPrice(bag.price)}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {bag.description}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Stock:</span>
              <span className={bag.stock > 0 ? 'text-accent font-medium' : 'text-destructive font-medium'}>
                {bag.stock > 0 ? `${bag.stock} available` : 'Out of stock'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{categoryLabels[bag.category] || bag.category}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Added:</span>
              <span className="font-medium">{formatDate(bag.createdAt)}</span>
            </div>
          </div>

          {bag.stock > 0 && bag.stock <= 5 && (
            <Badge variant="destructive" className="w-fit">
              Only {bag.stock} left in stock!
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
