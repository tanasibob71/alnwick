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
import { Loader2, Mail, FileText, ExternalLink, Calendar, Clock, User, Building, Map } from 'lucide-react';
import { Booking, Room } from '@shared/schema';
import AdminLayout from '@/components/layout/admin-layout';

export default function AdminBookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings'],
  });

  const { data: rooms, isLoading: roomsLoading } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  const isLoading = bookingsLoading || roomsLoading;

  if (isLoading) {
    return (
      <AdminLayout title="Room Bookings">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (bookingsError) {
    return (
      <AdminLayout title="Room Bookings">
        <div className="p-4 text-red-500">
          Error loading bookings: {bookingsError.message}
        </div>
      </AdminLayout>
    );
  }

  // Get room name from roomId
  const getRoomName = (roomId: number) => {
    const room = rooms?.find(r => r.id === roomId);
    return room ? room.name : 'Unknown Room';
  };

  // Filter bookings based on tab
  const filteredBookings = bookings || [];
  const pendingBookings = filteredBookings.filter(b => b.status === 'pending');
  const approvedBookings = filteredBookings.filter(b => b.status === 'approved');
  const rejectedBookings = filteredBookings.filter(b => b.status === 'rejected');

  return (
    <AdminLayout title="Room Bookings">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Room Bookings</h1>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {filteredBookings.length} Total Bookings
            </Badge>
            {pendingBookings.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1">
                {pendingBookings.length} Pending
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <AdminBookingsTable 
              bookings={filteredBookings} 
              getRoomName={getRoomName}
              onViewDetails={booking => {
                setSelectedBooking(booking);
                setIsViewModalOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <AdminBookingsTable 
              bookings={pendingBookings} 
              getRoomName={getRoomName}
              onViewDetails={booking => {
                setSelectedBooking(booking);
                setIsViewModalOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <AdminBookingsTable 
              bookings={approvedBookings} 
              getRoomName={getRoomName}
              onViewDetails={booking => {
                setSelectedBooking(booking);
                setIsViewModalOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <AdminBookingsTable 
              bookings={rejectedBookings} 
              getRoomName={getRoomName}
              onViewDetails={booking => {
                setSelectedBooking(booking);
                setIsViewModalOpen(true);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal for viewing booking details */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Submitted {selectedBooking?.createdAt ? formatDistanceToNow(new Date(selectedBooking.createdAt), { addSuffix: true }) : 'recently'}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Booking Status</h3>
                  <Badge 
                    variant={
                      selectedBooking.status === 'approved' ? 'default' : 
                      selectedBooking.status === 'rejected' ? 'destructive' : 
                      'outline'
                    }
                    className="capitalize"
                  >
                    {selectedBooking.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Requested Date</h3>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedBooking.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Room Requested</h3>
                  <p className="font-medium flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {getRoomName(selectedBooking.roomId)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Time Slot</h3>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedBooking.startTime && selectedBooking.endTime 
                      ? `${selectedBooking.startTime} - ${selectedBooking.endTime}`
                      : selectedBooking.timeSlot || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Name</h3>
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedBooking.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                  <a
                    href={`mailto:${selectedBooking.email}`}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-4 w-4" /> {selectedBooking.email}
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                  <p>{selectedBooking.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Organization</h3>
                  <p>{selectedBooking.organization || 'Not provided'}</p>
                </div>
              </div>

              {selectedBooking.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Event Description</h3>
                  <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                    {selectedBooking.description}
                  </div>
                </div>
              )}

              {selectedBooking.eventImage && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Event Image</h3>
                  <div className="rounded-md overflow-hidden border bg-muted">
                    <img 
                      src={selectedBooking.eventImage} 
                      alt="Event image" 
                      className="object-cover max-h-64 w-full"
                    />
                    <div className="p-2 text-right">
                      <a 
                        href={selectedBooking.eventImage} 
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
                <Button
                  variant="default"
                  onClick={() => {
                    window.location.href = `mailto:${selectedBooking.email}?subject=Regarding your booking at Alnwick Community Center`;
                  }}
                >
                  Contact via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

interface AdminBookingsTableProps {
  bookings: Booking[];
  getRoomName: (roomId: number) => string;
  onViewDetails: (booking: Booking) => void;
}

function AdminBookingsTable({ bookings, getRoomName, onViewDetails }: AdminBookingsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(booking.date).toLocaleDateString()}
                      <div className="text-xs text-muted-foreground">
                        {booking.createdAt
                          ? `Requested ${formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}`
                          : ''}
                      </div>
                    </TableCell>
                    <TableCell>{getRoomName(booking.roomId)}</TableCell>
                    <TableCell>{booking.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {booking.organization || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {booking.startTime && booking.endTime 
                        ? `${booking.startTime} - ${booking.endTime}`
                        : booking.timeSlot || 'Not specified'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          booking.status === 'approved' ? 'default' : 
                          booking.status === 'rejected' ? 'destructive' : 
                          'outline'
                        }
                        className="capitalize"
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(booking)}
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