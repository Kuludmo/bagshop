import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Bag } from '@/lib/types';

interface BagCardProps {
  bag: Bag;
}

export function BagCard({ bag }: BagCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
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

  return (
    <Link href={`/bags/${bag._id}`}>
      <Card className="group overflow-hidden border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
           src={bag.image || "/placeholder.svg"}
           alt={bag.name}
           className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {bag.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
          {bag.stock > 0 && bag.stock <= 5 && (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3 text-xs"
            >
              Only {bag.stock} left
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs">
              {categoryLabels[bag.category] || bag.category}
            </Badge>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
              {bag.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {bag.description}
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatPrice(bag.price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
