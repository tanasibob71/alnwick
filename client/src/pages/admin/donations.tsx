import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Mail, ExternalLink, Clock, User, DollarSign, Repeat, Eye, EyeOff } from 'lucide-react';
import { Donation } from '@shared/schema';
import AdminLayout from '@/components/layout/admin-layout';

export default function AdminDonations() {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { data: donations, isLoading, error } = useQuery<Donation[]>({
    queryKey: ['/api/admin/donations'],
  });

  if (isLoading) {
    return (
      <AdminLayout title="Donations">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Donations">
        <div className="p-4 text-red-500">
          Error loading donations: {error.message}
        </div>
      </AdminLayout>
    );
  }

  // Filter donations based on tab
  const filteredDonations = donations || [];
  const recurringDonations = filteredDonations.filter(d => d.isRecurring);
  const oneDonations = filteredDonations.filter(d => !d.isRecurring);
  const anonymousDonations = filteredDonations.filter(d => d.isAnonymous);

  // Calculate total donation amount
  const totalAmount = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <AdminLayout title="Donations">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Donations</h1>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {filteredDonations.length} Total Donations
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              ${totalAmount.toLocaleString()}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All Donations</TabsTrigger>
            <TabsTrigger value="one-time">One-Time</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
            <TabsTrigger value="anonymous">Anonymous</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <AdminDonationsTable 
              donations={filteredDonations} 
              onViewDetails={donation => {
                setSelectedDonation(donation);
                setIsViewModalOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="one-time" className="space-y-4">
            <AdminDonationsTable 
              donations={oneDonations} 
              onViewDetails={donation => {
                setSelectedDonation(donation);
                setIsViewModalOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="recurring" className="space-y-4">
            <AdminDonationsTable 
              donations={recurringDonations}
              onViewDetails={donation => {
                setSelectedDonation(donation);
                setIsViewModalOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="anonymous" className="space-y-4">
            <AdminDonationsTable 
              donations={anonymousDonations}
              onViewDetails={donation => {
                setSelectedDonation(donation);
                setIsViewModalOpen(true);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal for viewing donation details */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Received {selectedDonation?.createdAt ? formatDistanceToNow(new Date(selectedDonation.createdAt), { addSuffix: true }) : 'recently'}
            </DialogDescription>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1 flex items-center gap-1 text-lg">
                    <DollarSign className="h-4 w-4" />
                    {selectedDonation.amount.toLocaleString()}
                  </Badge>
                  {selectedDonation.isRecurring && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Repeat className="h-3 w-3" /> Recurring
                    </Badge>
                  )}
                  {selectedDonation.isAnonymous && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <EyeOff className="h-3 w-3" /> Anonymous
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground text-sm">
                  {selectedDonation.createdAt ? new Date(selectedDonation.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Donor Name</h3>
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedDonation.isAnonymous 
                      ? 'Anonymous Donor'
                      : selectedDonation.name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                  {selectedDonation.isAnonymous ? (
                    <p className="text-muted-foreground flex items-center gap-1">
                      <EyeOff className="h-4 w-4" /> Hidden
                    </p>
                  ) : (
                    <a
                      href={`mailto:${selectedDonation.email}`}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Mail className="h-4 w-4" /> {selectedDonation.email}
                    </a>
                  )}
                </div>
              </div>

              {selectedDonation.message && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Message</h3>
                  <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                    {selectedDonation.message}
                  </div>
                </div>
              )}

              {selectedDonation.imageUrl && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Attached Image</h3>
                  <div className="rounded-md overflow-hidden border bg-muted">
                    <img 
                      src={selectedDonation.imageUrl} 
                      alt="Donation image" 
                      className="object-cover max-h-64 w-full"
                    />
                    <div className="p-2 text-right">
                      <a 
                        href={selectedDonation.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" /> View full image
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                {!selectedDonation.isAnonymous && (
                  <Button
                    variant="default"
                    onClick={() => {
                      window.location.href = `mailto:${selectedDonation.email}?subject=Thank you for your donation to Alnwick Community Center`;
                    }}
                  >
                    Send Thank You Email
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

interface AdminDonationsTableProps {
  donations: Donation[];
  onViewDetails: (donation: Donation) => void;
}

function AdminDonationsTable({ donations, onViewDetails }: AdminDonationsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No donations found
                  </TableCell>
                </TableRow>
              ) : (
                donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="whitespace-nowrap">
                      {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'N/A'}
                      <div className="text-xs text-muted-foreground">
                        {donation.createdAt
                          ? formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })
                          : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      {donation.isAnonymous ? (
                        <div className="flex items-center gap-1">
                          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Anonymous</span>
                        </div>
                      ) : (
                        <div>
                          {donation.name}
                          {donation.email && (
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {donation.email}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="px-2 py-0.5 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> 
                        {donation.amount.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {donation.isRecurring ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Repeat className="h-3 w-3" /> Recurring
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">One-time</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {donation.message || <span className="text-muted-foreground text-sm">No message</span>}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(donation)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}