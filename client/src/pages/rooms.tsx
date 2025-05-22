import { useQuery } from "@tanstack/react-query";
import { Room } from "@shared/schema";
import RoomCard from "@/components/rooms/room-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NewsletterSection from "@/components/newsletter-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

const Rooms = () => {
  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });

  return (
    <>
      <Helmet>
        <title>Rentals | Alnwick Community Center</title>
        <meta name="description" content="Explore our versatile rental spaces available for community events, meetings, classes, and celebrations at Alnwick Community Center in Maryville, TN." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Rentals</h1>
            <p className="text-xl text-gray-700 mb-8">
              Explore our versatile spaces available for community events, meetings, classes, and celebrations in Maryville, TN.
            </p>
            <Link href="/booking">
              <Button size="lg">Book a Rental Now</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Rooms Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-28" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Rental Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Rental Information</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Rental Rates</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                      <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Per Hour</th>
                      <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Half Day</th>
                      <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Full Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-3 border-b text-sm">Gymnasium</td>
                      <td className="py-2 px-3 border-b text-sm">$40</td>
                      <td className="py-2 px-3 border-b text-sm">$120</td>
                      <td className="py-2 px-3 border-b text-sm">$250</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b text-sm">Community Room (50 capacity)</td>
                      <td className="py-2 px-3 border-b text-sm">$30</td>
                      <td className="py-2 px-3 border-b text-sm">$100</td>
                      <td className="py-2 px-3 border-b text-sm">$180</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b text-sm">Classroom</td>
                      <td className="py-2 px-3 border-b text-sm">$25</td>
                      <td className="py-2 px-3 border-b text-sm">$100</td>
                      <td className="py-2 px-3 border-b text-sm">$180</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b text-sm">Community Kitchen</td>
                      <td className="py-2 px-3 border-b text-sm">$10</td>
                      <td className="py-2 px-3 border-b text-sm">$40</td>
                      <td className="py-2 px-3 border-b text-sm">$80</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b text-sm">Baseball Field</td>
                      <td className="py-2 px-3 border-b text-sm">$35</td>
                      <td className="py-2 px-3 border-b text-sm">$110</td>
                      <td className="py-2 px-3 border-b text-sm">$220</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b text-sm">Soccer Field</td>
                      <td className="py-2 px-3 border-b text-sm">$40</td>
                      <td className="py-2 px-3 border-b text-sm">$120</td>
                      <td className="py-2 px-3 border-b text-sm">$240</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b text-sm">Outdoor Pavilion</td>
                      <td className="py-2 px-3 border-b text-sm">$25</td>
                      <td className="py-2 px-3 border-b text-sm">$80</td>
                      <td className="py-2 px-3 border-b text-sm">$150</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-2">* Nonprofit organizations receive a 20% discount with valid documentation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Booking Process</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Submit your booking request using our online form</li>
                  <li>Receive confirmation of availability within 24 hours</li>
                  <li>Complete payment to secure your reservation</li>
                  <li>Receive booking confirmation with detailed instructions</li>
                </ol>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Cancellation Policy</h3>
                <p className="text-gray-700 mb-4">
                  Cancellations made more than 14 days in advance receive a full refund. Cancellations between 7-14 days receive a 50% refund. No refunds for cancellations less than 7 days before the event.
                </p>
                <p className="text-gray-700">
                  In case of emergency closures due to weather or other circumstances, full refunds will be provided.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Amenities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Available Amenities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-bold mb-2">Event Spaces</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Multi-purpose gymnasium</li>
                  <li>• Community room with stage</li>
                  <li>• Flexible classroom space</li>
                  <li>• Community kitchen facilities</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-lg font-bold mb-2">Accessibility</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Wheelchair accessible</li>
                  <li>• Ground level access</li>
                  <li>• Accessible restrooms</li>
                  <li>• Ample parking</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <h3 className="text-lg font-bold mb-2">Outdoor Facilities</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Regulation baseball field</li>
                  <li>• Soccer field with goal posts</li>
                  <li>• Outdoor pavilion with picnic area</li>
                  <li>• Evening field lighting</li>
                  <li>• Spectator seating</li>
                  <li>• Equipment storage</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-bold mb-2">Utilities</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• High-speed Wi-Fi</li>
                  <li>• Heating and cooling</li>
                  <li>• Ample electrical outlets</li>
                  <li>• Adjustable lighting</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-bold mb-2">Furniture</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Tables and chairs</li>
                  <li>• Podiums</li>
                  <li>• Staging area</li>
                  <li>• Flexible seating options</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
                <h3 className="text-lg font-bold mb-2">Community Kitchen Access</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Refrigerator</li>
                  <li>• Stove and oven</li>
                  <li>• Food preparation areas</li>
                  <li>• Countertop space</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold mb-2">Operating Hours</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Monday - Sunday</li>
                  <li>• 9:00 AM - 10:00 PM</li>
                  <li>• Available all year round</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to book a rental for your event?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100">
            Our team is ready to help make your next event, meeting, or gathering a success.
          </p>
          <Link href="/booking">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-blue-50">
              Book a Rental Now
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

export default Rooms;
