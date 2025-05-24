import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Rentals from "@/pages/rentals";
import Events from "@/pages/events";
import Booking from "@/pages/booking";
import Fundraising from "@/pages/fundraising";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import AdminEvents from "@/pages/admin/events";
import SiteImagesAdmin from "@/pages/admin/site-images";
import AdminUsers from "@/pages/admin/users";
import AdminContactMessages from "@/pages/admin/contact-messages";
import AdminBookings from "@/pages/admin/bookings";
import AdminDonations from "@/pages/admin/donations";
import AdminNewsletterSubscribers from "@/pages/admin/newsletter-subscribers";
import ComposeNewsletter from "@/pages/admin/compose-newsletter";
import { ProtectedRoute } from "@/components/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AnnouncementBanner from "@/components/announcement-banner";

function Router() {
  const [location] = useLocation();
  // Don't show announcement banner on admin pages, dashboard, profile
  const showBanner = !location.includes('/admin') && 
                     !location.includes('/dashboard') && 
                     !location.includes('/profile');
                     
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {showBanner && <AnnouncementBanner />}
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/rentals" component={Rentals} />
          <Route path="/events" component={Events} />
          <Route path="/booking" component={Booking} />
          <Route path="/fundraising" component={Fundraising} />
          <Route path="/contact" component={Contact} />
          <Route path="/auth" component={Auth} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/admin/events" component={AdminEvents} adminOnly={true} />
          <ProtectedRoute path="/admin/site-images" component={SiteImagesAdmin} adminOnly={true} />
          <ProtectedRoute path="/admin/users" component={AdminUsers} adminOnly={true} />
          <ProtectedRoute path="/admin/contact-messages" component={AdminContactMessages} adminOnly={true} />
          <ProtectedRoute path="/admin/bookings" component={AdminBookings} adminOnly={true} />
          <ProtectedRoute path="/admin/donations" component={AdminDonations} adminOnly={true} />
          <ProtectedRoute path="/admin/newsletter-subscribers" component={AdminNewsletterSubscribers} adminOnly={true} />
          <ProtectedRoute path="/admin/compose-newsletter" component={ComposeNewsletter} adminOnly={true} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
