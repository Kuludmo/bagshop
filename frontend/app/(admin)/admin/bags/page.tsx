'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { bagsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BagFormDialog } from '@/components/admin/bag-form-dialog';
import { toast } from 'sonner';
import type { Bag, BagFormData, Pagination } from '@/lib/types';

export default function AdminBagsPage() {
  const [bags, setBags] = useState<Bag[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBag, setEditingBag] = useState<Bag | null>(null);
  const [deletingBag, setDeletingBag] = useState<Bag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBags = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await bagsApi.getAll({ page, limit: 100, search: search || undefined });
      setBags(response.data || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch bags:', error);
      toast.error('Failed to load bags');
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchBags();
  }, [fetchBags]);

  const handleCreate = async (data: BagFormData) => {
    setIsSubmitting(true);
    try {
      await bagsApi.create(data);
      toast.success('Bag created successfully');
      setIsFormOpen(false);
      fetchBags();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create bag');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: BagFormData) => {
    if (!editingBag) return;
    setIsSubmitting(true);
    try {
      await bagsApi.update(editingBag._id, data);
      toast.success('Bag updated successfully');
      setEditingBag(null);
      fetchBags();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update bag');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBag) return;
    setIsSubmitting(true);
    try {
      await bagsApi.delete(deletingBag._id);
      toast.success('Bag deleted successfully');
      setDeletingBag(null);
      fetchBags();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete bag');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    laptop: 'Laptop',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bags</h1>
          <p className="text-muted-foreground">Manage your bag inventory</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bag
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search bags..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : bags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No bags found
                </TableCell>
              </TableRow>
            ) : (
              bags.map((bag) => (
                <TableRow key={bag._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                        <img
                          src={bag.image || '/placeholder.svg'}
                          alt={bag.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{bag.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                          {bag.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryLabels[bag.category] || bag.category}</Badge>
                  </TableCell>
                  <TableCell>{formatPrice(bag.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={bag.stock === 0 ? 'destructive' : bag.stock <= 1 ? 'secondary' : 'outline'}
                    >
                      {bag.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingBag(bag)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDeletingBag(bag)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={page === pagination.pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <BagFormDialog
        open={isFormOpen || !!editingBag}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            setEditingBag(null);
          }
        }}
        bag={editingBag}
        onSubmit={editingBag ? handleUpdate : handleCreate}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingBag} onOpenChange={(open) => !open && setDeletingBag(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingBag?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
