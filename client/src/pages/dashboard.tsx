import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip as RechartsTooltip } from "recharts";
import { 
  Activity,
  BarChart2,
  CalendarDays, 
  Clock, 
  Heart, 
  History, 
  Home, 
  LogOut,
  Settings, 
  Star, 
  Sparkles,
  Ticket, 
  User,
  Users,
  Image,
  PlusCircle,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Mail,
  BookOpen,
  DollarSign,
  Bell
} from "lucide-react";

interface UserData {
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    lastLoginAt: string | null;
    profilePictureUrl: string | null;
  };
}

interface DashboardData {
  success: boolean;
  dashboard?: {
    metrics?: {
      userInteractionCount?: number;
      eventAttendanceRate?: number;
      volunteerHours?: number;
      totalEngagement?: number;
      engagementRating?: number;
      engagementTrend?: number;
    };
    bookings?: any[];
    upcomingEvents?: any[];
    eventRegistrations?: any[];
    recentVolunteerHours?: any[];
    activitySummary?: {
      labels: string[];
      data: number[];
    };
    success?: boolean;
  };
}

// Loading State Component
function LoadingDashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-20 bg-gray-200 rounded"></div>
          <div className="h-10 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <div className="h-10 bg-gray-200 rounded mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon, 
  description,
  trend,
  colorClass = "text-primary",
  isString = false
}: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode;
  description?: string;
  trend?: { direction: 'up' | 'down' | 'neutral'; value: number };
  colorClass?: string;
  isString?: boolean;
}) {
  const renderTrendIndicator = () => {
    if (!trend) return null;
    
    const { direction, value } = trend;
    const formattedValue = `${value}%`;
    
    if (direction === 'up') {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">{formattedValue}</span>
        </div>
      );
    }
    
    if (direction === 'down') {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">{formattedValue}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-gray-500">
        <span className="text-xs font-medium">No change</span>
      </div>
    );
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-2">{title}</p>
            <div className="flex items-baseline">
              <div className={`text-2xl font-bold ${colorClass}`}>{isString ? value : typeof value === 'number' ? value.toLocaleString() : 0}</div>
            </div>
            {description && <p className="text-muted-foreground text-xs mt-1">{description}</p>}
          </div>
          <div className={`p-2 rounded-full ${colorClass} bg-opacity-10`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-3">{renderTrendIndicator()}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [, setLocation] = useLocation();
  
  // Navigation helper
  const navigate = (path: string) => {
    setLocation(path);
  };
  
  // Get current user
  const { 
    data: userData, 
    isLoading: userLoading, 
    isError: userError,
  } = useQuery<UserData>({ 
    queryKey: ['/api/auth/me'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Get dashboard data
  const { 
    data: dashboardData, 
    isLoading: dashboardLoading, 
    isError: dashboardError,
  } = useQuery<DashboardData>({ 
    queryKey: ['/api/dashboard'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!userData?.success,
  });
  
  // Check if user is authenticated
  const isAuthenticated = !!userData?.success;
  
  // Check if user is admin
  const isAdmin = userData?.user?.role === 'admin';
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!userLoading && !userData?.success) {
      navigate("/auth");
    }
  }, [userLoading, userData?.success, navigate]);
  
  if (userLoading) return <LoadingDashboard />;
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="hidden md:flex md:w-64 lg:w-72 flex-col border-r bg-white shadow-sm">
        <div className="p-4 border-b">
          <Button 
            variant="ghost" 
            className="w-full justify-start mb-2 hover:bg-transparent"
            onClick={() => navigate('/')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Button>
          <h2 className="text-lg font-bold text-primary">Alnwick Center</h2>
          <p className="text-sm text-gray-500">User Dashboard</p>
        </div>
        
        <div className="py-4 flex flex-col flex-1">
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary/10 text-primary p-2 rounded-full">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{userData?.user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{userData?.user?.role || 'Member'}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1">
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              className="w-full justify-start rounded-none mb-1"
              onClick={() => setActiveTab("overview")}
            >
              <Home className="h-4 w-4 mr-2" />
              Overview
            </Button>
            
            <Button 
              variant={activeTab === "insights" ? "default" : "ghost"} 
              className="w-full justify-start rounded-none mb-1"
              onClick={() => setActiveTab("insights")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Insights
            </Button>
            
            <Button 
              variant={activeTab === "bookings" ? "default" : "ghost"} 
              className="w-full justify-start rounded-none mb-1"
              onClick={() => setActiveTab("bookings")}
            >
              <Ticket className="h-4 w-4 mr-2" />
              Bookings
            </Button>
            
            <Button 
              variant={activeTab === "events" ? "default" : "ghost"} 
              className="w-full justify-start rounded-none mb-1"
              onClick={() => setActiveTab("events")}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Events
            </Button>
            
            <Button 
              variant={activeTab === "volunteer" ? "default" : "ghost"} 
              className="w-full justify-start rounded-none mb-1"
              onClick={() => setActiveTab("volunteer")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Volunteer
            </Button>
            
            <Button 
              variant={activeTab === "settings" ? "default" : "ghost"} 
              className="w-full justify-start rounded-none mb-1"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            {isAdmin && (
              <>
                <div className="mt-6 mb-2 px-3">
                  <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    Admin Panel
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none mb-1"
                  onClick={() => navigate('/admin/users')}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none mb-1"
                  onClick={() => navigate('/admin/contact-messages')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Messages
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none mb-1"
                  onClick={() => navigate('/admin/bookings')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Room Bookings
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none mb-1"
                  onClick={() => navigate('/admin/donations')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Donations
                </Button>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start rounded-none mb-1 text-blue-700 font-medium bg-blue-50"
                    onClick={() => navigate('/admin/newsletter-subscribers')}
                  >
                    <Bell className="h-4 w-4 mr-2 text-blue-700" />
                    Newsletter Subscribers
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none mb-1"
                  onClick={() => navigate('/admin/events')}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Manage Events
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none mb-1"
                  onClick={() => navigate('/admin/site-images')}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Site Images
                </Button>
              </>
            )}
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
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="grid grid-cols-6 gap-px">
          <Button 
            variant="ghost" 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => setActiveTab("overview")}
          >
            <Home className="h-4 w-4 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => setActiveTab("insights")}
          >
            <Activity className="h-4 w-4 mb-1" />
            <span className="text-xs">Stats</span>
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => setActiveTab("bookings")}
          >
            <Ticket className="h-4 w-4 mb-1" />
            <span className="text-xs">Book</span>
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => setActiveTab("events")}
          >
            <CalendarDays className="h-4 w-4 mb-1" />
            <span className="text-xs">Events</span>
          </Button>
          {isAdmin ? (
            <Button 
              variant="ghost" 
              className="rounded-none flex flex-col items-center justify-center py-2 px-0"
              onClick={() => {
                // Toggle between admin pages or go to first one
                if (window.location.pathname === '/admin/users') {
                  navigate('/admin/newsletter-subscribers');
                } else if (window.location.pathname === '/admin/newsletter-subscribers') {
                  navigate('/admin/users');
                } else {
                  navigate('/admin/users');
                }
              }}
            >
              <ShieldCheck className="h-4 w-4 mb-1" />
              <span className="text-xs">Admin</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="rounded-none flex flex-col items-center justify-center py-2 px-0"
              onClick={() => setActiveTab("volunteer")}
            >
              <Heart className="h-4 w-4 mb-1" />
              <span className="text-xs">Help</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="rounded-none flex flex-col items-center justify-center py-2 px-0"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4 mb-1" />
            <span className="text-xs">Exit</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
        <Helmet>
          <title>My Dashboard | Alnwick Community Center</title>
          <meta name="description" content="View your personal Alnwick Community Center dashboard. Track your engagement, bookings, and volunteer hours." />
        </Helmet>
        
        {/* Mobile header */}
        <div className="md:hidden flex flex-col mb-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 mr-2" 
              onClick={() => navigate('/')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Button>
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <Button variant="ghost" size="sm" className="p-0 h-8" onClick={() => navigate('/profile')}>
              <User className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-1">
            Welcome, {userData?.user?.name || 'User'}
          </p>
        </div>
        
        {/* Desktop header - simplified since we have sidebar */}
        <div className="hidden md:block mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {activeTab === "overview" ? "Dashboard Overview" : 
             activeTab === "insights" ? "Activity Insights" :
             activeTab === "bookings" ? "My Bookings" :
             activeTab === "events" ? "Event Registrations" :
             activeTab === "volunteer" ? "Volunteer Activity" : "Account Settings"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {activeTab === "overview" ? "Track your activity and engagement with Alnwick Community Center" :
             activeTab === "insights" ? "Visualize your participation and engagement metrics" :
             activeTab === "bookings" ? "Manage your room and facility bookings" :
             activeTab === "events" ? "View your event registrations and history" :
             activeTab === "volunteer" ? "Log and track your volunteer contributions" : "Manage your account preferences"}
          </p>
        </div>
        
        {dashboardError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error loading dashboard</AlertTitle>
            <AlertDescription>
              There was a problem loading your dashboard data. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Content Tabs */}
        <div className="space-y-6">
          {/* Content: Overview - Only show when activeTab is overview */}
          <div className={activeTab === "overview" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard 
                title="Engagement Score" 
                value={dashboardData?.dashboard?.metrics?.engagementRating || 0}
                icon={<Star className="h-5 w-5" />}
                trend={{ direction: 'up', value: 12 }}
                description="Your overall engagement level"
              />
              <MetricCard 
                title="Event Attendance" 
                value={`${dashboardData?.dashboard?.metrics?.eventAttendanceRate || 0}%`}
                icon={<CalendarDays className="h-5 w-5" />}
                trend={{ direction: 'up', value: 5 }}
                description="Percentage of events attended"
                isString
              />
              <MetricCard 
                title="Volunteer Hours" 
                value={dashboardData?.dashboard?.metrics?.volunteerHours || 0}
                icon={<Clock className="h-5 w-5" />}
                trend={{ direction: 'down', value: 3 }}
                description="Total hours volunteered"
              />
              <MetricCard 
                title="Recent Activity" 
                value={dashboardData?.dashboard?.metrics?.userInteractionCount || 0}
                icon={<Activity className="h-5 w-5" />}
                description="Actions in the last 30 days"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2" />
                    Activity Breakdown
                  </CardTitle>
                  <CardDescription>Your participation by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {dashboardLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="animate-pulse">
                        <div className="h-40 w-80 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Events', value: dashboardData?.dashboard?.metrics?.eventAttendanceRate || 0 },
                          { name: 'Bookings', value: dashboardData?.dashboard?.metrics?.totalEngagement || 0 },
                          { name: 'Volunteer', value: dashboardData?.dashboard?.metrics?.volunteerHours || 0 },
                        ]}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#4338ca" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2" />
                    Activity Trends
                  </CardTitle>
                  <CardDescription>How your engagement has changed over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {dashboardLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="animate-pulse">
                        <div className="h-40 w-80 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', engagement: 12 },
                          { month: 'Feb', engagement: 19 },
                          { month: 'Mar', engagement: 15 },
                          { month: 'Apr', engagement: 25 },
                          { month: 'May', engagement: 32 },
                        ]}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="engagement" stroke="#4f46e5" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events you're registered for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse flex items-center space-x-4">
                          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </div>
                      ))
                    ) : dashboardData?.dashboard?.upcomingEvents?.length ? (
                      dashboardData.dashboard.upcomingEvents.map((event, i) => (
                        <div key={i} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                          <div className="bg-primary/10 text-primary p-2 rounded-full">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <Badge variant="outline">{event.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(event.date).toLocaleDateString()} - {event.time}
                            </p>
                            <p className="text-sm mt-1">Location: {event.location}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No upcoming events found.</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/events')}>
                          Browse Events
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Your recent room bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      ))
                    ) : dashboardData?.dashboard?.bookings?.length ? (
                      dashboardData.dashboard.bookings.map((booking, i) => (
                        <div key={i} className="p-3 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{booking.room}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(booking.date).toLocaleDateString()} • {booking.time}
                              </p>
                            </div>
                            <Badge 
                              variant={booking.status === 'Confirmed' ? 'default' : 
                                      booking.status === 'Pending' ? 'outline' : 
                                      'destructive'}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No recent bookings found.</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/booking')}>
                          Book a Room
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Content: Insights - Only show when activeTab is insights */}
          <div className={activeTab === "insights" ? "block" : "hidden"}>
            {/* Metrics will go here */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <MetricCard 
                title="Total Engagement" 
                value={dashboardData?.dashboard?.metrics?.totalEngagement || 0}
                icon={<Sparkles className="h-5 w-5" />}
                description="Overall engagement points"
              />
              <MetricCard 
                title="Events Attended" 
                value={dashboardData?.dashboard?.eventRegistrations?.length || 0}
                icon={<Calendar className="h-5 w-5" />}
                description="Total events you've joined"
              />
              <MetricCard 
                title="Room Bookings" 
                value={dashboardData?.dashboard?.bookings?.length || 0}
                icon={<Ticket className="h-5 w-5" />}
                description="Facilities you've reserved"
              />
              <MetricCard 
                title="Volunteer Rating" 
                value={`${dashboardData?.dashboard?.metrics?.engagementRating || 0}/10`}
                icon={<Star className="h-5 w-5" />}
                description="Your contribution score"
                isString
              />
            </div>
          </div>
          
          {/* Content: Bookings - Only show when activeTab is bookings */}
          <div className={activeTab === "bookings" ? "block" : "hidden"}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">My Bookings</h2>
                <p className="text-muted-foreground">Manage your room reservations</p>
              </div>
              <Button onClick={() => navigate('/booking')}>Book a Room</Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your room and facility reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))
                  ) : dashboardData?.dashboard?.bookings?.length ? (
                    dashboardData.dashboard.bookings.map((booking, i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div>
                            <h4 className="font-semibold text-lg">{booking.room}</h4>
                            <div className="flex items-center text-muted-foreground mt-1">
                              <CalendarDays className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                {new Date(booking.date).toLocaleDateString()} • {booking.time}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{booking.purpose}</p>
                          </div>
                          <div className="flex items-center space-x-2 mt-3 md:mt-0">
                            <Badge 
                              variant={booking.status === 'Confirmed' ? 'default' : 
                                booking.status === 'Pending' ? 'outline' : 
                                'destructive'}
                            >
                              {booking.status}
                            </Badge>
                            <Button variant="outline" size="sm">Details</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">You don't have any bookings yet.</p>
                      <Button className="mt-2" onClick={() => navigate('/booking')}>
                        Book a Room
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content: Events - Only show when activeTab is events */}
          <div className={activeTab === "events" ? "block" : "hidden"}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Events</h2>
                <p className="text-muted-foreground">Your event registrations and history</p>
              </div>
              <Button onClick={() => navigate('/events')}>View All Events</Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Upcoming Events</CardTitle>
                <CardDescription>Events you've registered for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse flex items-start space-x-4">
                        <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))
                  ) : dashboardData?.dashboard?.upcomingEvents?.length ? (
                    dashboardData.dashboard.upcomingEvents.map((event, i) => (
                      <div key={i} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                          <Calendar className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(event.date).toLocaleDateString()} - {event.time}
                          </p>
                          <p className="text-sm mt-1">Location: {event.location}</p>
                          <p className="text-sm mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">You haven't registered for any upcoming events.</p>
                      <Button className="mt-2" onClick={() => navigate('/events')}>
                        Browse Events
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content: Volunteer - Only show when activeTab is volunteer */}
          <div className={activeTab === "volunteer" ? "block" : "hidden"}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Volunteer Activity</h2>
                <p className="text-muted-foreground">Track your contributions to the community</p>
              </div>
              <Button>Log Hours</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {dashboardData?.dashboard?.metrics?.volunteerHours || 0}
                  </div>
                  <p className="text-muted-foreground text-sm">Hours contributed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {dashboardData?.dashboard?.recentVolunteerHours?.length || 0}
                  </div>
                  <p className="text-muted-foreground text-sm">Activities in last 30 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Volunteer Rank</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {
                      dashboardData?.dashboard?.metrics?.volunteerHours ? 
                        dashboardData.dashboard.metrics.volunteerHours > 20 ? "Gold" : 
                        dashboardData.dashboard.metrics.volunteerHours > 10 ? "Silver" : "Bronze"
                      : "Bronze"
                    }
                  </div>
                  <p className="text-muted-foreground text-sm">Your current status</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Volunteer History</CardTitle>
                <CardDescription>Your recent volunteer contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse flex items-start space-x-4">
                        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    ))
                  ) : dashboardData?.dashboard?.recentVolunteerHours?.length ? (
                    dashboardData.dashboard.recentVolunteerHours.map((entry, i) => (
                      <div key={i} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-center bg-primary/10 text-primary h-10 w-10 rounded-full flex-shrink-0">
                          <Heart className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{entry.activity}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(entry.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge>{entry.hours} hours</Badge>
                          </div>
                          <p className="text-sm mt-2">{entry.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No volunteer hours logged yet.</p>
                      <Button className="mt-2">Log Hours</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content: Settings - Only show when activeTab is settings */}
          <div className={activeTab === "settings" ? "block" : "hidden"}>
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            
            {userData?.user?.role === 'admin' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Admin Tools</CardTitle>
                  <CardDescription>Special tools for administrators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" onClick={() => navigate('/admin/site-images')} className="justify-start w-full">
                      <Image className="h-4 w-4 mr-2" />
                      Manage Site Images
                    </Button>
                    
                    <Button variant="outline" onClick={() => navigate('/admin/users')} className="justify-start w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    
                    <Button variant="outline" onClick={() => navigate('/admin/events')} className="justify-start w-full">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Manage Events
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue={userData?.user?.name || ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={userData?.user?.email || ''} disabled />
                    </div>
                  </div>
                  <Button type="button">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button type="button">Change Password</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how we contact you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your activity
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Event Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders about upcoming events
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Booking Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates about your room bookings
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Community center news and updates
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </div>
                <Button className="mt-4">Save Preferences</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}