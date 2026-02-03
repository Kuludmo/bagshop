'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Bag, BagFormData, BagCategory } from '@/lib/types';

const bagSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category: z.enum(['handbag', 'backpack', 'crossbody', 'tote', 'clutch', 'messenger', 'duffel', 'laptop']),
  image: z.string().url('Please enter a valid URL'),
  stock: z.coerce.number().int().min(0, 'Stock must be non-negative'),
});

type FormData = z.infer<typeof bagSchema>;

interface BagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bag: Bag | null;
  onSubmit: (data: BagFormData) => Promise<void>;
  isSubmitting: boolean;
}

const categories: { value: BagCategory; label: string }[] = [
  { value: 'handbag', label: 'Handbag' },
  { value: 'backpack', label: 'Backpack' },
  { value: 'crossbody', label: 'Crossbody' },
  { value: 'tote', label: 'Tote' },
  { value: 'clutch', label: 'Clutch' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'duffel', label: 'Duffel' },
  { value: 'laptop', label: 'Laptop Bag' },
];

export function BagFormDialog({
  open,
  onOpenChange,
  bag,
  onSubmit,
  isSubmitting,
}: BagFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(bagSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: 'handbag',
      image: '',
      stock: 0,
    },
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    if (bag) {
      reset({
        name: bag.name,
        description: bag.description,
        price: bag.price,
        category: bag.category,
        image: bag.image,
        stock: bag.stock,
      });
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        category: 'handbag',
        image: '',
        stock: 0,
      });
    }
  }, [bag, reset]);

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bag ? 'Edit Bag' : 'Add New Bag'}</DialogTitle>
          <DialogDescription>
            {bag ? 'Update the bag details below' : 'Fill in the details to add a new bag'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Premium Leather Bag"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="A beautiful handcrafted bag..."
              rows={3}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price')}
                placeholder="99.99"
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock')}
                placeholder="10"
                className={errors.stock ? 'border-destructive' : ''}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setValue('category', value as BagCategory)}
            >
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              {...register('image')}
              placeholder="https://example.com/image.jpg"
              className={errors.image ? 'border-destructive' : ''}
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {bag ? 'Updating...' : 'Creating...'}
                </>
              ) : bag ? (
                'Update Bag'
              ) : (
                'Create Bag'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
