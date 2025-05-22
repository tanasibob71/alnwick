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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Mail, Check, FileText, ExternalLink, Calendar } from 'lucide-react';
import { ContactMessage } from '@shared/schema';
import AdminLayout from '@/components/layout/admin-layout';

export default function AdminContactMessages() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { data: messages, isLoading, error } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/contact-messages'],
  });

  if (isLoading) {
    return (
      <AdminLayout title="Contact Messages">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Contact Messages">
        <div className="p-4 text-red-500">
          Error loading contact messages: {error.message}
        </div>
      </AdminLayout>
    );
  }

  const filteredMessages = messages || [];

  return (
    <AdminLayout title="Contact Messages">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <Badge variant="outline" className="px-3 py-1">
            {filteredMessages.length} Messages
          </Badge>
        </div>

        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter Subscribers</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Attachments</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No contact messages found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMessages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell className="whitespace-nowrap">
                              {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'N/A'}
                              <div className="text-xs text-muted-foreground">
                                {message.createdAt
                                  ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
                                  : ''}
                              </div>
                            </TableCell>
                            <TableCell>{message.name}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              <a
                                href={`mailto:${message.email}`}
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <Mail className="h-3 w-3" /> {message.email}
                              </a>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {message.subject || 'No subject'}
                            </TableCell>
                            <TableCell>
                              {message.attachments && message.attachments.length > 0 ? (
                                <Badge variant="outline" className="gap-1">
                                  <FileText className="h-3 w-3" /> {message.attachments.length}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">None</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedMessage(message);
                                  setIsViewModalOpen(true);
                                }}
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
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.filter(m => m.subscribeToNewsletter).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No newsletter subscribers found from contact messages
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMessages
                          .filter(m => m.subscribeToNewsletter)
                          .map((message) => (
                            <TableRow key={message.id}>
                              <TableCell className="whitespace-nowrap">
                                {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'N/A'}
                                <div className="text-xs text-muted-foreground">
                                  {message.createdAt
                                    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
                                    : ''}
                                </div>
                              </TableCell>
                              <TableCell>{message.name}</TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                <a
                                  href={`mailto:${message.email}`}
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  <Mail className="h-3 w-3" /> {message.email}
                                </a>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {message.subject || 'No subject'}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedMessage(message);
                                    setIsViewModalOpen(true);
                                  }}
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal for viewing a message */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Received {selectedMessage?.createdAt ? formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true }) : 'recently'}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">From</h3>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-4 w-4" /> {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                  <p>{selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Newsletter Subscription</h3>
                  <div className="flex items-center gap-1">
                    {selectedMessage.subscribeToNewsletter ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Subscribed</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Not subscribed</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Subject</h3>
                <p className="text-lg font-medium">{selectedMessage.subject || 'No subject'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Message</h3>
                <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Attachments</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMessage.attachments.map((attachment, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate flex-1">{attachment.split('/').pop()}</span>
                        <a 
                          href={attachment} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
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
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message to Alnwick Community Center'}`;
                  }}
                >
                  Reply via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}