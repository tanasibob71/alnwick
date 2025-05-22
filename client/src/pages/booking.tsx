import { useQuery } from "@tanstack/react-query";
import { Room } from "@shared/schema";
import BookingForm from "@/components/forms/booking-form";
import NewsletterSection from "@/components/newsletter-section";
import { Helmet } from "react-helmet";

const Booking = () => {
  return (
    <>
      <Helmet>
        <title>Book a Rental | Alnwick Community Center</title>
        <meta name="description" content="Reserve a rental space at Alnwick Community Center in Maryville, TN for your next meeting, event, or gathering. Various spaces available to suit your needs." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Book a Rental</h1>
            <p className="text-xl text-gray-700 mb-8">
              Reserve one of our rental spaces in Maryville, TN for your next meeting, event, or gathering.
            </p>
          </div>
        </div>
      </section>
      
      {/* Booking Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-5xl mx-auto">
            <div className="md:flex">
              <div className="md:w-1/2 p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4">Booking Request Form</h2>
                <BookingForm />
              </div>
              <div className="md:w-1/2 bg-gray-50 p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4">Booking Information</h2>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Rental Rates</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase">Rental</th>
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
                          <td className="py-2 px-3 border-b text-sm">Community Room</td>
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
                          <td className="py-2 px-3 text-sm">Community Kitchen</td>
                          <td className="py-2 px-3 text-sm">$10</td>
                          <td className="py-2 px-3 text-sm">$40</td>
                          <td className="py-2 px-3 text-sm">$80</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">* Nonprofit organizations receive a 20% discount with valid documentation.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Booking Process</h3>
                    <ol className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
                      <li>Submit your booking request using this form</li>
                      <li>Receive confirmation of availability within 24 hours</li>
                      <li>Complete payment to secure your reservation</li>
                      <li>Receive booking confirmation with detailed instructions</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Cancellation Policy</h3>
                    <p className="text-sm text-gray-700">
                      Cancellations made more than 14 days in advance receive a full refund. Cancellations between 7-14 days receive a 50% refund. No refunds for cancellations less than 7 days before the event.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Operating Hours</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Monday - Sunday: 9am - 10pm
                    </p>
                    
                    <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-700">
                      Contact our booking coordinator at <a href="mailto:alnwickcommunityc@gmail.com" className="text-primary hover:underline">alnwickcommunityc@gmail.com</a> or call 865-257-2122.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-3">What's included in the rental?</h3>
              <p className="text-gray-700">
                Rentals include tables, chairs, WiFi access, and basic equipment. Additional services like specialized setups or catering are available for additional fees.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-3">How far in advance should I book?</h3>
              <p className="text-gray-700">
                We recommend booking at least 3-4 weeks in advance for small events and 2-3 months for larger events. Popular dates and weekends tend to fill up quickly.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-3">Can I bring my own food or use outside caterers?</h3>
              <p className="text-gray-700">
                Yes, you're welcome to bring your own food or hire outside caterers. If you need kitchen access, be sure to include that in your booking. We also have a list of recommended local caterers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-3">What is your alcohol policy?</h3>
              <p className="text-gray-700">
                Alcohol service requires proper permits and licensed servers. Please notify us in advance if you plan to serve alcohol, and we'll provide the necessary forms and requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-3">Is there parking available?</h3>
              <p className="text-gray-700">
                Yes, we have a free parking lot with 50 spaces. Additional street parking is available nearby. For large events, we can provide information about overflow parking options.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-3">When can we access the room for setup?</h3>
              <p className="text-gray-700">
                Standard bookings include 30 minutes before and after your event for setup and cleanup. If you need additional time, please let us know when booking and we'll try to accommodate.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

export default Booking;
