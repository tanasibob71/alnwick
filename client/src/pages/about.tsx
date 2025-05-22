import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NewsletterSection from "@/components/newsletter-section";
import StaticMap from "@/components/map/static-map";
import { CalendarClock, Users, MapPin, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";
import centerBuildingImage from "@assets/476309153_651427824112904_7560014837730764580_n.jpg";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Alnwick Community Center</title>
        <meta name="description" content="Learn about Alnwick Community Center's mission, history, and impact on our Maryville, TN community since 1985." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">About Alnwick Community Center</h1>
            <p className="text-xl text-gray-700 mb-8">
              A cornerstone of our Maryville, TN community for over 35 years, dedicated to bringing people together.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img 
                src={centerBuildingImage} 
                alt="Alnwick Community Center Building" 
                className="rounded-lg shadow-md w-full h-auto object-cover" 
              />
              <p className="text-sm text-gray-600 mt-2 text-center">The Alnwick Community Center building with its iconic entrance sign</p>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                Established in 1985, the Alnwick Community Center in Maryville, TN is dedicated to providing accessible 
                spaces and programs that foster connection, learning, and growth for all residents.
              </p>
              <p className="text-gray-700 mb-4">
                We believe in the power of community spaces to transform lives, create opportunities, 
                and build stronger neighborhoods. Our center serves as a hub where people of all ages 
                and backgrounds can gather, learn new skills, celebrate important milestones, and form 
                lasting connections.
              </p>
              <p className="text-gray-700 mb-4">
                Our facilities are open Monday through Sunday from 9am to 10pm, providing ample opportunity 
                for community members to utilize our spaces for their various needs throughout the week.
              </p>
              <p className="text-gray-700">
                As a 501(c)(3) nonprofit organization, we rely on the generosity of our community to 
                continue offering affordable services and maintaining our facilities for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Our Impact</h2>
            <p className="max-w-2xl mx-auto">For over three decades, we've been making a difference in Maryville.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="bg-white/10 p-6 rounded-lg text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">2,000+</h3>
              <p>Annual Visitors</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarClock className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-2">200+</h3>
              <p>Events Yearly</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-2">2</h3>
              <p>Sports and Event Fields</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-2">4</h3>
              <p>Community Rooms</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-2">38</h3>
              <p>Years Serving Maryville</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Our History</h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 text-center md:text-right">
                  <div className="inline-block bg-primary text-white text-xl font-bold py-2 px-4 rounded">1985</div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold mb-2">Center Established</h3>
                  <p className="text-gray-700">
                    Alnwick Community Center in Maryville was founded by a group of dedicated local residents who saw a need for a central gathering space for community events, classes, and meetings.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 text-center md:text-right">
                  <div className="inline-block bg-primary text-white text-xl font-bold py-2 px-4 rounded">1992</div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold mb-2">Expansion Project</h3>
                  <p className="text-gray-700">
                    Growing demand led to our first major expansion, adding the Gymnasium and Community Room to accommodate larger events and multiple simultaneous activities.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 text-center md:text-right">
                  <div className="inline-block bg-primary text-white text-xl font-bold py-2 px-4 rounded">2005</div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold mb-2">Kitchen Renovation</h3>
                  <p className="text-gray-700">
                    The Community Kitchen was renovated enabling cooking for events, community meals, and catering for events.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 text-center md:text-right">
                  <div className="inline-block bg-primary text-white text-xl font-bold py-2 px-4 rounded">2023</div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold mb-2">Building Remodel Campaign</h3>
                  <p className="text-gray-700">
                    Today, we're raising funds for critical updates to our facility, including accessibility improvements, energy efficiency upgrades, and modernized spaces to serve our community for decades to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hours of Operation Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Hours of Operation</h2>
            <div className="inline-block bg-primary text-white text-xl font-bold py-4 px-8 rounded-lg mb-4">
              Monday - Sunday: 9am - 10pm
            </div>
            <p className="text-gray-700 mb-4">
              Our facilities are open every day of the week to ensure our community always has a place to gather, 
              learn, and connect. Whether you're looking to host an event, participate in a program, or simply 
              use our community spaces, we're here to welcome you.
            </p>
            <p className="text-gray-700">
              Staff is available throughout our operating hours to assist with room bookings, answer questions, 
              and ensure that your experience at Alnwick Community Center is exceptional.
            </p>
          </div>
        </div>
      </section>
      
      {/* Leadership Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Our Leadership</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Meet the dedicated team guiding the Alnwick Community Center's mission and impact in Maryville, TN.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                <img 
                  src="/assets/leadership/bob-black.jpg" 
                  alt="Bob Black - Board President" 
                  className="w-full h-full object-cover"
                  style={{ 
                    objectPosition: "50% 0%", 
                    transform: "scale(1.8)" 
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Bob Black</h3>
              <p className="text-primary font-medium mb-3">Board President</p>
              <p className="text-gray-600 text-sm">
                Dedicated to community service with a background in urban planning and development.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-1">Laura Duchane</h3>
              <p className="text-primary font-medium mb-3">Board Secretary</p>
              <p className="text-gray-600 text-sm">
                Leading our center with over 20 years of nonprofit experience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                <img 
                  src="/assets/leadership/howard-kerr.jpg" 
                  alt="Howard Kerr - Board Treasurer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Howard Kerr</h3>
              <p className="text-primary font-medium mb-3">Board Treasurer</p>
              <p className="text-gray-600 text-sm">
                Creating inclusive community programs that foster learning and connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Find Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Find Us</h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-10">
            <Link href="/contact">
              <Button size="lg" className="text-base px-6">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="outline" className="text-base px-6">
                Book a Space
              </Button>
            </Link>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <StaticMap 
              height="auto"
              width="100%"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

export default About;