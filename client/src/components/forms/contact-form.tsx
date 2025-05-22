import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertContactMessageSchema } from "@shared/schema";
import { LoaderPinwheel } from "lucide-react";
import { FileUpload, UploadedFile } from "@/components/ui/file-upload";

// Form schema from the shared schema
const contactFormSchema = insertContactMessageSchema;

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const handleFilesUpload = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };
  
  // Form setup
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      subscribeToNewsletter: false,
    },
  });
  
  // Create contact message mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      // Add file attachments to the form data
      const payload = {
        ...values,
        attachments: uploadedFiles.length > 0 ? uploadedFiles.map(file => file.url) : null
      };
      return apiRequest("POST", "/api/contact", payload);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. Your message has been sent to the Alnwick Community Center (alnwickcommunityc@gmail.com) and stored in our system.",
      });
      form.reset();
      setUploadedFiles([]);
      setSubmittedSuccessfully(true);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Message submission failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: ContactFormValues) => {
    mutate(values);
  };
  
  if (submittedSuccessfully) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
          <h3 className="font-bold text-lg mb-2">Message Sent Successfully!</h3>
          <p>Thank you for contacting us. We will get back to you as soon as possible.</p>
        </div>
        <Button onClick={() => setSubmittedSuccessfully(false)}>Send Another Message</Button>
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General Information</SelectItem>
                  <SelectItem value="booking">Room Booking Question</SelectItem>
                  <SelectItem value="donation">Donation Inquiry</SelectItem>
                  <SelectItem value="volunteer">Volunteer Opportunities</SelectItem>
                  <SelectItem value="feedback">Feedback/Suggestions</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4 my-4">
          <FormLabel>File Attachments (Optional)</FormLabel>
          <FileUpload 
            onMultipleFilesUpload={handleFilesUpload}
            multiple={true}
            maxFiles={3}
            acceptedFileTypes="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            showPreview={true}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: images (JPG, PNG, GIF, WebP, SVG, BMP, TIFF) and documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV)
          </p>
          {uploadedFiles.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} attached
            </p>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="subscribeToNewsletter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Subscribe to our newsletter for updates on events and programs
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Note</h3>
              <div className="text-sm text-blue-700">
                <p>
                  Form submissions are sent to the Alnwick Community Center email (alnwickcommunityc@gmail.com) and stored for administrative review. Our team will respond as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full mt-4" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
