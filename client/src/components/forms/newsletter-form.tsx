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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertNewsletterSubscriberSchema } from "@shared/schema";
import { LoaderPinwheel } from "lucide-react";

// Form schema from shared schema
const newsletterFormSchema = insertNewsletterSubscriberSchema;

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

const NewsletterForm = () => {
  const { toast } = useToast();
  
  // Form setup
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Subscribe mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: NewsletterFormValues) => {
      return apiRequest("POST", "/api/newsletter/subscribe", values);
    },
    onSuccess: () => {
      toast({
        title: "Subscription received!",
        description: "Thank you for subscribing to our newsletter. Your email has been sent to the Alnwick Community Center and added to our database.",
      });
      form.reset();
    },
    onError: (error) => {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: NewsletterFormValues) => {
    mutate(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input
                  placeholder="Your email address"
                  className="px-4 py-2 rounded focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="w-full bg-blue-50 border border-blue-200 rounded-md p-2 mb-2 flex-grow">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-xs text-blue-700">
                <p>Subscriptions are sent to the Alnwick Community Center email (alnwickcommunityc@gmail.com) and stored in our database for administrative use.</p>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          variant="secondary"
          className="px-6 py-2"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default NewsletterForm;
