import ContactForm from "@/components/forms/contact-form";
import NewsletterForm from "@/components/forms/newsletter-form";
import NewsletterSection from "@/components/newsletter-section";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, Navigation } from "lucide-react";
import { Helmet } from "react-helmet";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Alnwick Community Center</title>
        <meta name="description" content="Get in touch with Alnwick Community Center in Maryville, TN. Have questions or want to get involved? Reach out to our team." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-700 mb-8">
              Have questions or want to get involved? Reach out to the Alnwick Community Center team in Maryville, TN.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Form and Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-4">Send Us a Message</h2>
                  <ContactForm />
                </div>
                <div className="md:w-1/2 bg-gray-50 p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                        <MapPin className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Address</h3>
                        <p className="text-gray-700">2146 Big Springs Road<br />Maryville, TN 37801</p>
                        <a href="#find-us" className="inline-flex items-center mt-2 text-primary hover:text-primary-dark font-medium text-sm">
                          <Navigation className="w-4 h-4 mr-1" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                        <Phone className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-gray-700">865-257-2122</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                        <Mail className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-gray-700">alnwickcommunityc@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                        <Clock className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Hours</h3>
                        <p className="text-gray-700">Monday - Sunday: 9am - 10pm</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Follow Us</h3>
                      <div className="flex space-x-4">
                        <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                          <Facebook className="h-4 w-4" />
                        </a>
                        <a href="#" className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition">
                          <Twitter className="h-4 w-4" />
                        </a>
                        <a href="#" className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition">
                          <Instagram className="h-4 w-4" />
                        </a>
                        <a href="#" className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition">
                          <Youtube className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section id="find-us" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Find Us</h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary/10 p-6 flex flex-col md:flex-row items-center">
                <div className="bg-white rounded-full p-6 shadow-md mb-6 md:mb-0 md:mr-6">
                  <MapPin className="h-16 w-16 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Our Location</h3>
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold">Alnwick Community Center</span><br />
                    2146 Big Springs Road<br />
                    Maryville, TN 37801<br />
                    <span className="text-primary font-medium">(865) 257-2122</span>
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4">Directions</h3>
                <p className="text-gray-700 mb-4">
                  Alnwick Community Center is conveniently located at 2146 Big Springs Road, Maryville, TN 37801, easily accessible by car.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-1">By Car</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      <span className="font-medium">From Downtown Maryville:</span> Head east on W Broadway Ave (US-411). Continue for 1.5 miles. Turn left onto N Washington St. After 0.7 miles, turn right onto E Broadway Ave. Continue 1.2 miles, then turn left onto Big Springs Road. The Alnwick Community Center will be 0.8 miles ahead on your right, clearly marked with signage.
                      <br/><br/>
                      <span className="font-medium">From Knoxville/Airport (via Alcoa Hwy):</span> Take Alcoa Hwy (US-129) south. Exit onto US-411 E toward Sevierville. Continue 3.2 miles on US-411 E. Turn right onto Big Springs Road and continue for 1.5 miles. The Alnwick Community Center will be on your right.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1">Parking</h4>
                    <p className="text-gray-700 text-sm mb-3">
                      <span className="font-medium">Main Lot:</span> Free parking is available in our spacious main lot with 50+ spaces, located directly in front of the center. 
                      <br/><br/>
                      <span className="font-medium">Accessibility:</span> Designated accessible parking spots are available near the main entrance. The center is fully wheelchair accessible.
                      <br/><br/>
                      <span className="font-medium">Overflow:</span> During special events, additional parking is available along the east side of the building and in the grass field when weather permits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">How can I support the Community Center?</h3>
              <p className="text-gray-700">
                There are many ways to support our center: volunteer your time, donate to our building campaign, attend our events, or spread the word about our services and programs.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Are you currently accepting volunteers?</h3>
              <p className="text-gray-700">
                Yes! We always welcome volunteers. Please contact our Volunteer Coordinator at alnwickcommunityc@gmail.com or complete our contact form to learn about current opportunities.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">How do I rent a space at the center?</h3>
              <p className="text-gray-700">
                Visit our <Link href="/booking"><a className="text-primary hover:underline">Booking page</a></Link> to see available rental spaces and submit a reservation request, or contact our booking coordinator directly at alnwickcommunityc@gmail.com.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Do you offer scholarships for programs?</h3>
              <p className="text-gray-700">
                Yes, we have financial assistance available for many of our programs. Please inquire at the front desk or contact us for confidential assistance with scholarship applications.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Get Involved Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Get Involved</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Volunteer</h3>
              <p className="text-gray-700 mb-4">
                Share your time and talents with our community. We have opportunities for all skills and schedules.
              </p>
              <Button variant="outline" className="w-full">Learn More</Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Donate</h3>
              <p className="text-gray-700 mb-4">
                Support our building campaign and ongoing programs with a tax-deductible contribution.
              </p>
              <Link href="/fundraising">
                <Button variant="outline" className="w-full">Make a Donation</Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Spread the Word</h3>
              <p className="text-gray-700 mb-4">
                Follow us on social media and help share our mission and events with your network.
              </p>
              <Button variant="outline" className="w-full">Follow Us</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Find Us Section */}
      <section id="find-us" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Find Us</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="md:flex items-center">
                <div className="md:w-1/2 pr-6">
                  <h3 className="text-xl font-bold mb-4">Directions to Alnwick Community Center</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">From Downtown Maryville</h4>
                      <ol className="list-decimal list-inside text-gray-700 text-sm space-y-1 ml-4">
                        <li>Head east on E Broadway Avenue</li>
                        <li>Turn right onto Washington Street</li>
                        <li>Continue onto Big Springs Road for 1.5 miles</li>
                        <li>Alnwick Community Center will be on your right</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800">From Knoxville</h4>
                      <ol className="list-decimal list-inside text-gray-700 text-sm space-y-1 ml-4">
                        <li>Take I-140 W toward Maryville/Alcoa</li>
                        <li>Take exit 11 for TN-162/Pellissippi Pkwy</li>
                        <li>Continue onto US-129 S toward Maryville</li>
                        <li>Take the exit toward US-411/Sevierville</li>
                        <li>Turn left onto E Broadway Avenue</li>
                        <li>Follow directions from Downtown Maryville</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800">Public Transportation</h4>
                      <p className="text-gray-700 text-sm">
                        The East Tennessee Human Resource Agency (ETHRA) offers public transportation services to our location. Call 1-800-232-1565 to schedule a ride.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <div className="bg-gray-200 rounded-lg p-2 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto h-10 w-10 text-primary mb-2" />
                      <h4 className="font-semibold">Alnwick Community Center</h4>
                      <p className="text-gray-700">2146 Big Springs Road</p>
                      <p className="text-gray-700">Maryville, TN 37801</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Interactive maps are available on your mobile device's map application by searching "Alnwick Community Center"
                  </p>
                </div>
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

export default Contact;
