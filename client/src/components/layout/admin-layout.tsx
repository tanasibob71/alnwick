import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users,
  Image, 
  CalendarDays,
  ArrowLeft,
  Settings,
  LogOut,
  Mail,
  BookOpen,
  DollarSign,
  Bell,
  Send
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  
  // Navigation helper
  const navigate = (path: string) => {
    setLocation(path);
  };
  
  // Get current user
  const { data: userData } = useQuery<{ user: { name: string; role: string } }>({ 
    queryKey: ['/api/auth/me'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const isAdmin = userData?.user?.role === 'admin';
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="hidden md:flex md:w-64 lg:w-72 flex-col border-r bg-white shadow-sm">
        <div className="p-4 border-b">
          <Button 
            variant="ghost" 
            className="w-full justify-start mb-2 hover:bg-transparent"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-lg font-bold text-primary">Admin Panel</h2>
          <p className="text-sm text-gray-500">Alnwick Community Center</p>
        </div>
        
        <div className="py-4 flex flex-col flex-1">
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary/10 text-primary p-2 rounded-full">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{userData?.user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{userData?.user?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-2 space-y-1">
            <div className="py-2">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase px-2 mb-2">
                User Management
              </h3>
              <Button 
                variant={location === "/admin/users" ? "default" : "ghost"} 
                className="w-full justify-start mb-1"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
            
            <div className="py-2 bg-blue-50 rounded-md mx-2 mb-2">
              <h3 className="text-xs font-semibold text-blue-800 tracking-wider uppercase px-2 pt-2 mb-2">
                Newsletter Management
              </h3>
              <Button 
                variant={location === "/admin/newsletter-subscribers" ? "default" : "ghost"} 
                className="w-full justify-start mb-1 font-medium text-blue-700"
                onClick={() => navigate('/admin/newsletter-subscribers')}
              >
                <Bell className="h-4 w-4 mr-2" />
                Manage Subscribers
              </Button>
              <Button 
                variant={location === "/admin/compose-newsletter" ? "default" : "ghost"} 
                className="w-full justify-start mb-1 font-medium text-blue-700"
                onClick={() => navigate('/admin/compose-newsletter')}
              >
                <Send className="h-4 w-4 mr-2" />
                Compose Newsletter
              </Button>
            </div>
          
            <div className="py-2">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase px-2 mb-2">
                Content Management
              </h3>
              <Button 
                variant={location === "/admin/site-images" ? "default" : "ghost"} 
                className="w-full justify-start mb-1"
                onClick={() => navigate('/admin/site-images')}
              >
                <Image className="h-4 w-4 mr-2" />
                Site Images
              </Button>
              
              <Button 
                variant={location === "/admin/events" ? "default" : "ghost"} 
                className="w-full justify-start mb-1"
                onClick={() => navigate('/admin/events')}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Manage Events
              </Button>
            </div>
            
            <div className="py-2">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase px-2 mb-2">
                Form Submissions
              </h3>
              <Button 
                variant={location === "/admin/contact-messages" ? "default" : "ghost"} 
                className="w-full justify-start mb-1"
                onClick={() => navigate('/admin/contact-messages')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Messages
              </Button>
              
              <Button 
                variant={location === "/admin/bookings" ? "default" : "ghost"} 
                className="w-full justify-start mb-1"
                onClick={() => navigate('/admin/bookings')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Room Bookings
              </Button>
              
              <Button 
                variant={location === "/admin/donations" ? "default" : "ghost"} 
                className="w-full justify-start mb-1"
                onClick={() => navigate('/admin/donations')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Donations
              </Button>
            </div>
            
            <div className="py-2">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase px-2 mb-2">
                Navigation
              </h3>
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-1"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                View Website
              </Button>
            </div>
          </nav>
          
          <div className="mt-auto px-4 pb-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => navigate('/api/logout')}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-20 px-4 py-3">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-8 mr-2" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-8" 
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="grid grid-cols-5 gap-px">
          <Button 
            variant={location === "/admin/users" ? "default" : "ghost"} 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => navigate('/admin/users')}
          >
            <Users className="h-4 w-4 mb-1" />
            <span className="text-xs">Users</span>
          </Button>
          <Button 
            variant={location === "/admin/site-images" ? "default" : "ghost"} 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => navigate('/admin/site-images')}
          >
            <Image className="h-4 w-4 mb-1" />
            <span className="text-xs">Images</span>
          </Button>
          <Button 
            variant={
              location === "/admin/contact-messages" || 
              location === "/admin/bookings" || 
              location === "/admin/donations" || 
              location === "/admin/newsletter-subscribers"
                ? "default" 
                : "ghost"
            } 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => {
              // Toggle between form submission pages or go to first one
              if (location === "/admin/contact-messages") {
                navigate('/admin/bookings');
              } else if (location === "/admin/bookings") {
                navigate('/admin/donations'); 
              } else if (location === "/admin/donations") {
                navigate('/admin/newsletter-subscribers');
              } else if (location === "/admin/newsletter-subscribers") {
                navigate('/admin/contact-messages');
              } else {
                navigate('/admin/contact-messages');
              }
            }}
          >
            <Mail className="h-4 w-4 mb-1" />
            <span className="text-xs">Forms</span>
          </Button>
          <Button 
            variant={location === "/admin/events" ? "default" : "ghost"} 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => navigate('/admin/events')}
          >
            <CalendarDays className="h-4 w-4 mb-1" />
            <span className="text-xs">Events</span>
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mb-1" />
            <span className="text-xs">Back</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 pb-20 md:pb-8 mt-12 md:mt-0">
        <div className="hidden md:block mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        
        {children}
      </div>
    </div>
  );
}