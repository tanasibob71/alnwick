import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { insertDonationSchema } from "@shared/schema";
import { LoaderPinwheel } from "lucide-react";
import { FileUpload, UploadedFile } from "@/components/ui/file-upload";

// Extend the donation schema for the form
const donationFormSchema = insertDonationSchema.extend({
  // Custom amount handling
  selectedAmount: z.enum(["25", "50", "100", "250", "500", "other"]).optional(),
  customAmount: z.string().optional(),
}).refine(
  (data) => {
    if (data.selectedAmount === "other") {
      return !!data.customAmount && parseInt(data.customAmount) > 0;
    }
    return true;
  },
  {
    message: "Please enter a valid custom amount",
    path: ["customAmount"],
  }
);

type DonationFormValues = z.infer<typeof donationFormSchema>;

const DonationForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedFile | null>(null);
  
  const handleFileUpload = (file: UploadedFile) => {
    setUploadedImage(file);
  };
  
  // Form setup
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: 0,
      isRecurring: false,
      isAnonymous: false,
      selectedAmount: undefined,
      customAmount: "",
    },
  });
  
  // Show/hide custom amount field based on selection
  const watchSelectedAmount = form.watch("selectedAmount");
  const showCustomAmount = watchSelectedAmount === "other";
  
  // Create donation mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: DonationFormValues) => {
      const { selectedAmount, customAmount, ...rest } = values;
      
      let amount: number;
      if (selectedAmount === "other" && customAmount) {
        amount = parseInt(customAmount);
      } else if (selectedAmount) {
        amount = parseInt(selectedAmount);
      } else {
        amount = 0; // This shouldn't happen due to form validation
      }
      
      return apiRequest("POST", "/api/donations", {
        ...rest,
        amount,
        imageUrl: uploadedImage?.url || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donations/total'] });
      toast({
        title: "Donation request received!",
        description: "Thank you for your generous support. Your request has been sent to the Alnwick Community Center (alnwickcommunityc@gmail.com) and stored in our system for processing.",
      });
      form.reset();
      setUploadedImage(null);
      setSubmittedSuccessfully(true);
    },
    onError: (error) => {
      console.error("Error submitting donation:", error);
      toast({
        title: "Donation submission failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: DonationFormValues) => {
    mutate(values);
  };
  
  if (submittedSuccessfully) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
          <h3 className="font-bold text-lg mb-2">Thank You for Your Donation!</h3>
          <p>Your generous support will help us improve our community center for everyone.</p>
        </div>
        <Button onClick={() => setSubmittedSuccessfully(false)}>Make Another Donation</Button>
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="selectedAmount"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Amount</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-3 gap-2"
                >
                  {["25", "50", "100", "250", "500", "other"].map((value) => (
                    <div key={value} className="flex items-center">
                      <RadioGroupItem
                        value={value}
                        id={`amount-${value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`amount-${value}`}
                        className="flex items-center justify-center border border-gray-300 rounded-md py-2 w-full cursor-pointer hover:bg-blue-50 hover:border-primary transition peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:border-primary"
                      >
                        {value === "other" ? "Other" : `$${value}`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {showCustomAmount && (
          <FormField
            control={form.control}
            name="customAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      min="1"
                      className="pl-7"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
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
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isRecurring"
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
                  Make this a monthly recurring donation
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isAnonymous"
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
                  Make my donation anonymous
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <div className="mb-6">
          <FormLabel>Add an Image (Optional)</FormLabel>
          <p className="text-sm text-gray-500 mb-2">
            Upload an image to accompany your donation or to show what you're supporting.
          </p>
          <FileUpload 
            onFileUpload={handleFileUpload} 
            acceptedFileTypes="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            showPreview={true}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: images (JPG, PNG, GIF, WebP, SVG, BMP, TIFF) and documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV)
          </p>
          {uploadedImage && (
            <p className="text-sm text-green-600 mt-2">
              Image uploaded successfully: {uploadedImage.originalName}
            </p>
          )}
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Note</h3>
              <div className="text-sm text-yellow-700">
                <p>
                  Donation requests are sent to the Alnwick Community Center email (alnwickcommunityc@gmail.com) and stored for administrative review. Online payment processing is currently being set up. After submitting this form, you'll receive instructions for completing your donation via check or in person.
                </p>
              </div>
            </div>
          </div>
        </div>
        
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
                  Donation requests are currently being stored for administrative review. Our team will contact you with further instructions for completing your donation.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit Donation Request"
          )}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Donations are tax-deductible (Tax ID: 92-1085931)
            </span>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default DonationForm;
