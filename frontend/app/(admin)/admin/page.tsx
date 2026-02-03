'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Users, DollarSign, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import { bagsApi, usersApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Bag, Pagination } from '@/lib/types';

interface Stats {
  totalBags: number;
  totalUsers: number;
  totalAdmins: number;
  totalValue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBags, setRecentBags] = useState<Bag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bagsResponse, userStatsResponse] = await Promise.all([
          bagsApi.getAll({ limit: 5, sort: '-createdAt' }),
          usersApi.getStats(),
        ]);

        const bags = bagsResponse.data || [];
        const totalValue = bags.reduce((sum, bag) => sum + bag.price * bag.stock, 0);

        setRecentBags(bags);
        setStats({
          totalBags: bagsResponse.pagination?.total || 0,
          totalUsers: userStatsResponse.data?.users || 0,
          totalAdmins: userStatsResponse.data?.admins || 0,
          totalValue,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bags</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBags || 0}</div>
            <p className="text-xs text-muted-foreground">Products in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAdmins || 0}</div>
            <p className="text-xs text-muted-foreground">Admin accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats?.totalValue || 0)}</div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bags */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Bags</CardTitle>
            <CardDescription>Latest products added to inventory</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/bags">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBags.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No bags yet. Add your first product!
            </p>
          ) : (
            <div className="space-y-4">
              {recentBags.map((bag) => (
                <div
                  key={bag._id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={bag.image || '/placeholder.svg'}
                      alt={bag.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{bag.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{bag.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(bag.price)}</p>
                    <p className="text-sm text-muted-foreground">{bag.stock} in stock</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Products</CardTitle>
            <CardDescription>Add, edit, or remove bags from your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/bags">
                <Package className="mr-2 h-4 w-4" />
                Go to Bags
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>View and manage user accounts and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Go to Users
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
