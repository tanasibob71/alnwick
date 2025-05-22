import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { NewsletterSubscriber } from "@shared/schema";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/layout/admin-layout";

const AdminNewsletterPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<NewsletterSubscriber | null>(null);

  // Fetch newsletter subscribers
  const {
    data: subscribers = [],
    isLoading,
    isError
  } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/admin/newsletter-subscribers"],
  });

  // Delete subscriber mutation
  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/newsletter-subscribers/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete subscriber");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/newsletter-subscribers"] });
      setIsDeleteDialogOpen(false);
      setSubscriberToDelete(null);
      toast({
        title: "Subscriber deleted",
        description: "The subscriber has been removed from the newsletter list."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete subscriber",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Filter subscribers based on search query
  const filteredSubscribers = searchQuery
    ? subscribers.filter(subscriber => 
        subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : subscribers;

  // Handle delete confirmation
  const handleDeleteClick = (subscriber: NewsletterSubscriber) => {
    setSubscriberToDelete(subscriber);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subscriberToDelete) {
      deleteSubscriberMutation.mutate(subscriberToDelete.id);
    }
  };

  // If user is not authenticated or not an admin, redirect to auth page
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user.role !== "admin") {
    return <Redirect to="/auth" />;
  }

  return (
    <AdminLayout title="Newsletter Subscribers">
      <Helmet>
        <title>Newsletter Subscribers | Alnwick Community Center</title>
        <meta
          name="description"
          content="Manage newsletter subscribers for Alnwick Community Center"
        />
      </Helmet>

      <div className="container mx-auto px-4 py-4">
        <div className="flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 flex items-center text-gray-500 hover:text-gray-900"
                  onClick={() => window.history.back()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </Button>
              </div>
              <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
              <p className="text-gray-500">Manage email subscriptions for the Alnwick Community Center newsletter</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
                onClick={() => navigate("/admin/compose-newsletter")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Compose Newsletter
              </Button>
              <Input 
                placeholder="Search by email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
              <CardDescription>
                All emails subscribed to the Alnwick Community Center newsletter
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading subscribers. Please try again.
                </div>
              ) : filteredSubscribers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "No subscribers match your search." : "No subscribers found."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Subscribed On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium">{subscriber.email}</TableCell>
                          <TableCell>
                            {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(subscriber)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscriber</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {subscriberToDelete?.email} from the newsletter list?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteSubscriberMutation.isPending}
            >
              {deleteSubscriberMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNewsletterPage;