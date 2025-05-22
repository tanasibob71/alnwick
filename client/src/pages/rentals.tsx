import { useQuery } from "@tanstack/react-query";
import { Room } from "@shared/schema";
import RoomCard from "@/components/rooms/room-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NewsletterSection from "@/components/newsletter-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

const Rentals = () => {
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
      <section className="bg-gradient-to-r from-primary/90 to-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Rental Spaces</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find the perfect space for your next event, meeting, or celebration at Alnwick Community Center
          </p>
        </div>
      </section>
      
      {/* Indoor Spaces Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Indoor Spaces</h2>
          <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto">
            Our climate-controlled indoor spaces are perfect for meetings, classes, celebrations, and community events
          </p>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms
                .filter(room => !['Baseball Field', 'Soccer Field', 'Outdoor Pavilion'].includes(room.name))
                .map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Outdoor Spaces Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Outdoor Spaces</h2>
          <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto">
            Our beautiful outdoor spaces offer versatile options for sports, gatherings, celebrations, and more
          </p>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms
                .filter(room => ['Baseball Field', 'Soccer Field', 'Outdoor Pavilion'].includes(room.name))
                .map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Booking CTA */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Space?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Fill out our booking form to reserve your preferred rental space for your upcoming event or gathering.
          </p>
          <Link href="/booking">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Book a Rental Now
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Rental Rates</h2>
          <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto">
            Affordable rates for community members and organizations
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="border px-4 py-3 text-left">Space</th>
                  <th className="border px-4 py-3 text-center">Hourly Rate</th>
                  <th className="border px-4 py-3 text-center">Half Day (4 hours)</th>
                  <th className="border px-4 py-3 text-center">Full Day (8 hours)</th>
                  <th className="border px-4 py-3 text-center">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(7)].map((_, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="border px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="border px-4 py-3 text-center"><Skeleton className="h-4 w-16 mx-auto" /></td>
                      <td className="border px-4 py-3 text-center"><Skeleton className="h-4 w-16 mx-auto" /></td>
                      <td className="border px-4 py-3 text-center"><Skeleton className="h-4 w-16 mx-auto" /></td>
                      <td className="border px-4 py-3 text-center"><Skeleton className="h-4 w-16 mx-auto" /></td>
                    </tr>
                  ))
                ) : (
                  rooms.map((room, idx) => (
                    <tr key={room.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="border px-4 py-3 font-medium">{room.name}</td>
                      <td className="border px-4 py-3 text-center">
                        {room.hourlyRate === 0 ? 'TBA' : `$${room.hourlyRate}`}
                      </td>
                      <td className="border px-4 py-3 text-center">
                        {room.halfDayRate === 0 ? 'TBA' : `$${room.halfDayRate}`}
                      </td>
                      <td className="border px-4 py-3 text-center">
                        {room.fullDayRate === 0 ? 'TBA' : `$${room.fullDayRate}`}
                      </td>
                      <td className="border px-4 py-3 text-center">{room.capacity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-gray-600 text-sm max-w-3xl mx-auto">
            <p className="mb-2"><strong>Note:</strong> Nonprofit organizations may qualify for discounted rates. Please contact us for details.</p>
            <p>A refundable security deposit may be required depending on event type and duration.</p>
          </div>
        </div>
      </section>
      
      {/* Additional Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Rental Information</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Included with Your Rental</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Restroom access</li>
                <li>Basic tables and chairs (quantity varies by room)</li>
                <li>WiFi access</li>
                <li>Heat and air conditioning (indoor spaces)</li>
                <li>Access to parking area</li>
                <li>Basic cleaning supplies</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Rental Policies</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Reservations must be made at least 3 days in advance</li>
                <li>Full payment required to confirm booking</li>
                <li>Cancellations with less than 48 hours notice may not receive refund</li>
                <li>Renters are responsible for setup and cleanup</li>
                <li>No alcohol without proper permits and approval</li>
                <li>No smoking in indoor spaces</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/booking">
              <Button>Request a Reservation</Button>
            </Link>
            <Link href="/contact#find-us">
              <Button variant="outline" className="ml-4">Get Directions</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

export default Rentals;