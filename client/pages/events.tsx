import { useState } from "react";
import CalendarView from "@/components/calendar/calendar-view";
import NewsletterSection from "@/components/newsletter-section";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const refreshCalendarData = () => {
    setIsRefreshing(true);
    
    // Invalidate all events-related queries in the cache
    queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    
    // Show success message
    toast({
      title: "Calendar refreshed",
      description: "Events data has been updated with the latest information.",
      duration: 3000,
    });
    
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <>
      <Helmet>
        <title>Events Calendar | Alnwick Community Center</title>
        <meta name="description" content="Browse upcoming events and activities at Alnwick Community Center in Maryville, TN. Join us for classes, community gatherings, and more." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Upcoming Events</h1>
            <p className="text-xl text-gray-700 mb-4">
              Join us for these community events and activities at the Alnwick Community Center in Maryville, TN.
            </p>
            <p className="text-lg text-gray-700 mb-8"><span className="font-medium">Open Monday - Sunday, 9am - 10pm</span></p>
          </div>
        </div>
      </section>
      
      {/* Calendar Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshCalendarData}
              disabled={isRefreshing}
              className="text-primary border-primary hover:bg-primary/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Calendar'}
            </Button>
          </div>
          
          <CalendarView />
          
          <div className="mt-10 text-center">
            <Button variant="outline" className="border-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Events Calendar
            </Button>
          </div>
        </div>
      </section>
      
      {/* Event Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Event Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-3 bg-blue-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Classes</h3>
                <p className="text-gray-700 mb-4">
                  Expand your skills and knowledge with our diverse range of classes for all ages and interests.
                </p>
                <ul className="text-gray-700 space-y-1 mb-4">
                  <li>• Yoga and Fitness</li>
                  <li>• Art and Crafts</li>
                  <li>• Cooking Workshops</li>
                  <li>• Language Learning</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-3 bg-green-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Activities</h3>
                <p className="text-gray-700 mb-4">
                  Participate in social and recreational activities that bring our community together.
                </p>
                <ul className="text-gray-700 space-y-1 mb-4">
                  <li>• Game Nights</li>
                  <li>• Senior Socials</li>
                  <li>• Youth Programs</li>
                  <li>• Dance Events</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-3 bg-red-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Meetings</h3>
                <p className="text-gray-700 mb-4">
                  Regular gatherings of community groups, boards, and special interest organizations.
                </p>
                <ul className="text-gray-700 space-y-1 mb-4">
                  <li>• Board Meetings</li>
                  <li>• Community Forums</li>
                  <li>• Support Groups</li>
                  <li>• Committee Gatherings</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-3 bg-purple-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Community Events</h3>
                <p className="text-gray-700 mb-4">
                  Special events that bring together the wider community for celebration and connection.
                </p>
                <ul className="text-gray-700 space-y-1 mb-4">
                  <li>• Food Drives</li>
                  <li>• Seasonal Celebrations</li>
                  <li>• Fundraisers</li>
                  <li>• Cultural Festivals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recurring Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Regular Programs</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Weekly Programs</h3>
                <ul className="space-y-4">
                  <li className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <div className="font-semibold text-lg text-blue-800">Friday - Borderline Band Dance</div>
                    <div className="text-gray-700">6:00pm - 8:00pm • Gymnasium</div>
                    <div className="mt-2 text-gray-600">
                      Join us every Friday evening for live music and dancing with the Borderline Band. All ages welcome!
                    </div>
                  </li>
                  <li className="bg-purple-50 p-4 rounded-md border border-purple-200">
                    <div className="font-semibold text-lg text-purple-800">Friday - New Sounds Karaoke</div>
                    <div className="text-gray-700">6:00pm - 8:00pm • Community Room</div>
                    <div className="mt-2 text-gray-600">
                      Enjoy an evening of karaoke with New Sounds every Friday. Sing your favorite songs in a fun, supportive environment.
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Monthly Programs</h3>
                <ul className="space-y-4">
                  <li className="bg-green-50 p-4 rounded-md border border-green-200">
                    <div className="font-semibold text-lg text-green-800">Second Thursday - Alnwick Board Meeting</div>
                    <div className="text-gray-700">5:00pm - 6:00pm • Classroom</div>
                    <div className="mt-2 text-gray-600">
                      Monthly board meeting for the Alnwick Community Center. Community members are welcome to attend.
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-lg font-semibold mb-3">Special Events</h4>
                  <div className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 text-sm">
                      Additional special events are scheduled throughout the year. Check our calendar for details.
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4 w-full" onClick={() => window.location.href = '/contact'}>
                    Contact About Special Events
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Host an Event CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-primary p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Host Your Own Event</h3>
                <p className="mb-6">
                  Have an idea for a community event, class, or workshop? Partner with us to bring your vision to life.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Flexible spaces for various event types</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Marketing support through our channels</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Reduced rates for community-focused events</span>
                  </li>
                </ul>
                <Link href="/contact">
                  <Button variant="secondary" className="bg-white text-primary hover:bg-blue-50">
                    Contact Us About Your Event
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold mb-4">Event Planning Resources</h3>
                <p className="text-gray-700 mb-6">
                  We offer resources to help make your event planning process smooth and successful.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <span className="font-medium">Room Layout Options</span>
                      <p className="text-sm text-gray-600">Diagrams and capacity charts for each space</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <span className="font-medium">Vendor Recommendations</span>
                      <p className="text-sm text-gray-600">Local caterers, photographers, and more</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <span className="font-medium">Event Planning Checklist</span>
                      <p className="text-sm text-gray-600">Timeline and planning guides</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

export default Events;
