"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wouter_1 = require("wouter");
var queryClient_1 = require("./lib/queryClient");
var react_query_1 = require("@tanstack/react-query");
var toaster_1 = require("@/components/ui/toaster");
var tooltip_1 = require("@/components/ui/tooltip");
var not_found_1 = require("@/pages/not-found");
var home_1 = require("@/pages/home");
var about_1 = require("@/pages/about");
var rentals_1 = require("@/pages/rentals");
var events_1 = require("@/pages/events");
var booking_1 = require("@/pages/booking");
var fundraising_1 = require("@/pages/fundraising");
var contact_1 = require("@/pages/contact");
var auth_1 = require("@/pages/auth");
var dashboard_1 = require("@/pages/dashboard");
var profile_1 = require("@/pages/profile");
var events_2 = require("@/pages/admin/events");
var site_images_1 = require("@/pages/admin/site-images");
var users_1 = require("@/pages/admin/users");
var contact_messages_1 = require("@/pages/admin/contact-messages");
var bookings_1 = require("@/pages/admin/bookings");
var donations_1 = require("@/pages/admin/donations");
var newsletter_subscribers_1 = require("@/pages/admin/newsletter-subscribers");
var compose_newsletter_1 = require("@/pages/admin/compose-newsletter");
var protected_route_1 = require("@/components/protected-route");
var use_auth_1 = require("@/hooks/use-auth");
var header_1 = require("@/components/layout/header");
var footer_1 = require("@/components/layout/footer");
var announcement_banner_1 = require("@/components/announcement-banner");
function Router() {
    var location = (0, wouter_1.useLocation)()[0];
    // Don't show announcement banner on admin pages, dashboard, profile
    var showBanner = !location.includes('/admin') &&
        !location.includes('/dashboard') &&
        !location.includes('/profile');
    return (<div className="min-h-screen flex flex-col">
      <header_1.default />
      {showBanner && <announcement_banner_1.default />}
      <main className="flex-grow">
        <wouter_1.Switch>
          <wouter_1.Route path="/" component={home_1.default}/>
          <wouter_1.Route path="/about" component={about_1.default}/>
          <wouter_1.Route path="/rentals" component={rentals_1.default}/>
          <wouter_1.Route path="/events" component={events_1.default}/>
          <wouter_1.Route path="/booking" component={booking_1.default}/>
          <wouter_1.Route path="/fundraising" component={fundraising_1.default}/>
          <wouter_1.Route path="/contact" component={contact_1.default}/>
          <wouter_1.Route path="/auth" component={auth_1.default}/>
          <protected_route_1.ProtectedRoute path="/dashboard" component={dashboard_1.default}/>
          <protected_route_1.ProtectedRoute path="/profile" component={profile_1.default}/>
          <protected_route_1.ProtectedRoute path="/admin/events" component={events_2.default} adminOnly={true}/>
          <protected_route_1.ProtectedRoute path="/admin/site-images" component={site_images_1.default} adminOnly={true}/>
          <protected_route_1.ProtectedRoute path="/admin/users" component={users_1.default} adminOnly={true}/>
          <protected_route_1.ProtectedRoute path="/admin/contact-messages" component={contact_messages_1.default} adminOnly={true}/>
          <protected_route_1.ProtectedRoute path="/admin/bookings" component={bookings_1.default} adminOnly={true}/>
          <protected_route_1.ProtectedRoute path="/admin/donations" component={donations_1.default} adminOnly={true}/>
          <protected_route_1.ProtectedRoute path="/admin/newsletter-subscribers" component={newsletter_subscribers_1.default} adminOnly={true}/>
          <protected_route_1.ProtectedRoute path="/admin/compose-newsletter" component={compose_newsletter_1.default} adminOnly={true}/>
          <wouter_1.Route component={not_found_1.default}/>
        </wouter_1.Switch>
      </main>
      <footer_1.default />
    </div>);
}
function App() {
    return (<react_query_1.QueryClientProvider client={queryClient_1.queryClient}>
      <use_auth_1.AuthProvider>
        <tooltip_1.TooltipProvider>
          <toaster_1.Toaster />
          <Router />
        </tooltip_1.TooltipProvider>
      </use_auth_1.AuthProvider>
    </react_query_1.QueryClientProvider>);
}
exports.default = App;
