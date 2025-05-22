import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const NewsletterSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = async (data: NewsletterFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/newsletter/subscribe", data);
      
      toast({
        title: "Subscription received!",
        description: "Thank you for subscribing to our newsletter. Your email has been added to our database.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter to receive updates on events, programs, and community news.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Your email address"
                      className="bg-white px-4 py-2 rounded focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-left text-sm text-red-200" />
                </FormItem>
              )}
            />
            <div className="bg-blue-200 bg-opacity-20 border border-blue-300 rounded-md p-2 mb-2 w-full text-left text-sm text-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p>Subscriptions are stored in our database for administrative use.</p>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="bg-white text-primary font-semibold px-6 py-2 rounded hover:bg-blue-50 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default NewsletterSection;
