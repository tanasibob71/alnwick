import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { NewsletterSubscriber } from "@shared/schema";
import { Helmet } from "react-helmet";
import { Loader2, Send, ChevronDown } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/components/layout/admin-layout";

// Define the form schema
const newsletterFormSchema = z.object({
  subject: z.string().min(1, {
    message: "Subject is required",
  }),
  content: z.string().min(10, {
    message: "Content should be at least 10 characters long",
  }),
  testMode: z.boolean().default(true),
  testEmail: z.string().email({
    message: "Please provide a valid email for testing",
  }).optional().or(z.literal('')),
});

// Infer the form types
type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

const ComposeNewsletterPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  // Form definition
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      subject: "",
      content: "",
      testMode: true,
      testEmail: "",
    },
  });
  
  const testMode = form.watch("testMode");
  const formValues = form.watch();
  
  // Fetch newsletter subscribers for count
  const {
    data: subscribers = [],
    isLoading: isLoadingSubscribers,
  } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/admin/newsletter-subscribers"],
  });
  
  // Send newsletter mutation
  const sendNewsletterMutation = useMutation({
    mutationFn: async (data: NewsletterFormValues) => {
      const res = await apiRequest("POST", "/api/admin/send-newsletter", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send newsletter");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: testMode ? "Test newsletter sent" : "Newsletter sent successfully",
        description: testMode 
          ? "The test newsletter has been sent to your test email address."
          : `The newsletter has been sent to ${subscribers.length} subscribers.`,
      });
      
      if (!testMode) {
        form.reset();
      }
      
      setShowConfirmDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send newsletter",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Generate preview HTML
  const generatePreviewHtml = () => {
    const { subject, content } = formValues;
    
    // Simple HTML template for the newsletter
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${subject}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #1d4ed8;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9fafb;
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${subject}</h1>
        </div>
        <div class="content">
          ${content.replace(/\n/g, '<br>')}
        </div>
        <div class="footer">
          <p>Alnwick Community Center</p>
          <p>2146 Big Springs Road, Maryville, TN 37801</p>
          <p>This email was sent to you because you subscribed to our newsletter.</p>
        </div>
      </body>
      </html>
    `;
    
    setPreviewHtml(html);
    setShowPreview(true);
  };
  
  // Handle form submission
  const onSubmit = (data: NewsletterFormValues) => {
    // If in test mode, make sure test email is provided
    if (data.testMode && (!data.testEmail || data.testEmail.trim() === "")) {
      toast({
        title: "Test email required",
        description: "Please provide a test email address when in test mode.",
        variant: "destructive",
      });
      return;
    }
    
    setShowConfirmDialog(true);
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
    <AdminLayout title="Compose Newsletter">
      <Helmet>
        <title>Compose Newsletter | Alnwick Community Center</title>
        <meta
          name="description"
          content="Compose and send newsletters to subscribers"
        />
      </Helmet>

      <div className="container mx-auto px-4 py-4">
        <div className="flex-col space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="mb-2 flex items-center text-gray-500 hover:text-gray-900"
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
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">Compose Newsletter</h1>
                <Badge variant="outline" className="ml-3">
                  {isLoadingSubscribers ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    `${subscribers.length} subscribers`
                  )}
                </Badge>
              </div>
              <p className="text-gray-500 mt-1">
                Create and send newsletters to your subscribers
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={generatePreviewHtml}
                disabled={!form.getValues("content") || !form.getValues("subject")}
              >
                Preview Newsletter
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Newsletter Editor</CardTitle>
              <CardDescription>
                Compose your newsletter and choose your sending options
              </CardDescription>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Storage Mode Active</h3>
                    <div className="mt-1 text-sm text-yellow-700">
                      <p>Email sending is currently disabled while we set up a proper email provider. Your composed newsletters will be stored but not sent to subscribers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Line</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter newsletter subject..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            A compelling subject line increases open rates
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Newsletter Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your newsletter content here..." 
                              className="h-64 resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Use clear paragraphs and keep your message focused
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="sending-options">
                        <AccordionTrigger>Sending Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <FormField
                              control={form.control}
                              name="testMode"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Test Mode
                                    </FormLabel>
                                    <FormDescription>
                                      Only send to test email address
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            {testMode && (
                              <FormField
                                control={form.control}
                                name="testEmail"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Test Email Address</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Enter test email address..." 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      The newsletter will only be sent to this email for testing
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="flex items-center" 
                      disabled={sendNewsletterMutation.isPending}
                    >
                      {sendNewsletterMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {testMode ? "Send Test Newsletter" : "Send Newsletter"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Newsletter Preview</DialogTitle>
            <DialogDescription>
              This is how your newsletter will appear to subscribers
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md mt-2">
            <iframe
              srcDoc={previewHtml}
              title="Newsletter Preview"
              className="w-full h-[50vh] rounded-md"
              frameBorder="0"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {testMode ? "Send Test Newsletter?" : "Send Newsletter to All Subscribers?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {testMode
                ? "This will send a test newsletter to the specified email address."
                : `This action will send the newsletter to all ${subscribers.length} subscribers. This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => sendNewsletterMutation.mutate(form.getValues())}
              disabled={sendNewsletterMutation.isPending}
            >
              {sendNewsletterMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Newsletter"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ComposeNewsletterPage;