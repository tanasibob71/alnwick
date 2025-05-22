import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import NewsletterSection from "@/components/newsletter-section";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/476309153_651427824112904_7560014837730764580_n.jpg" 
            alt="Alnwick Community Center in Maryville" 
            className="w-full h-full object-cover opacity-70" 
          />
        </div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Community Hub in Maryville</h1>
            <p className="text-xl mb-6">A space for gathering, learning, and celebrating - bringing people together since 1985.</p>
            <p className="text-lg mb-8"><span className="font-medium">Open Monday - Sunday, 9am - 10pm</span></p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/booking">
                <Button size="lg" className="w-full sm:w-auto">Book a Rental</Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" size="lg" className="bg-white hover:bg-gray-100 text-primary w-full sm:w-auto">
                  View Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">About Alnwick Community Center</h2>
              <p className="mb-4 text-gray-700">
                Established in 1985, the Alnwick Community Center serves as a cornerstone of our community. 
                Our mission is to provide accessible spaces and programs that foster connection, learning, 
                and growth for all residents.
              </p>
              <p className="mb-4 text-gray-700">
                As a 501(c)(3) nonprofit organization, we rely on the generosity of our community to 
                continue offering affordable services and maintaining our facilities.
              </p>
              <div className="flex flex-wrap gap-4 my-6">
                <div className="flex items-center bg-gray-100 px-4 py-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">2,000+</h3>
                    <p className="text-sm text-gray-600">Annual Visitors</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-100 px-4 py-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">200+</h3>
                    <p className="text-sm text-gray-600">Events Yearly</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-100 px-4 py-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">2</h3>
                    <p className="text-sm text-gray-600">Sports and Event Fields</p>
                  </div>
                </div>
              </div>
              <Link href="/about">
                <Button variant="outline" className="mt-2">
                  Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/assets/476309153_651427824112904_7560014837730764580_n.jpg" 
                alt="Alnwick Community Center Building in Maryville" 
                className="rounded-xl shadow-lg w-full h-auto object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rentals Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Rentals</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Explore our versatile rental spaces available for community events, meetings, classes, and celebrations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gymnasium */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <img 
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Gymnasium" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Gymnasium</h3>
                <p className="text-gray-700 mb-4">
                  Our largest space, perfect for community events, performances, basketball games, and large gatherings.
                  Features a full-sized court with basketball hoops. Can accommodate up to 200 people.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Capacity: 200</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Basketball Court</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Sports Equipment</span>
                </div>
                <Link href="/booking">
                  <Button variant="link" className="p-0 h-auto">
                    Book this rental <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Community Room */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <img 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Community Room" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Community Room</h3>
                <p className="text-gray-700 mb-4">
                  Versatile meeting space perfect for business meetings, workshops, and community gatherings.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Capacity: 50</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Tables & Chairs</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Configurable Space</span>
                </div>
                <Link href="/booking">
                  <Button variant="link" className="p-0 h-auto">
                    Book this rental <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Classroom */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Classroom" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Classroom</h3>
                <p className="text-gray-700 mb-4">
                  Comfortable space for educational classes, meetings, and small group activities.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Capacity: 25</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Tables & Chairs</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Flexible Setup</span>
                </div>
                <Link href="/booking">
                  <Button variant="link" className="p-0 h-auto">
                    Book this rental <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-center mt-12 mb-8">Outdoor Rental Areas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Baseball Field */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <img 
                src="https://images.unsplash.com/photo-1562041255-d7c3b6b309b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400" 
                alt="Baseball Field" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Baseball Field</h3>
                <p className="text-gray-700 mb-4">
                  Regulation-sized baseball field with dugouts, perfect for baseball and softball games, practices, and tournaments.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Capacity: 100</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Dugouts</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Lighting</span>
                </div>
                <Link href="/booking">
                  <Button variant="link" className="p-0 h-auto">
                    Book this rental <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Soccer Field */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <img 
                src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400" 
                alt="Soccer Field" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Soccer Field</h3>
                <p className="text-gray-700 mb-4">
                  Well-maintained soccer field suitable for matches, practices, and sports events. Features goal posts and field markings.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Capacity: 150</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Goal Posts</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Field Markings</span>
                </div>
                <Link href="/booking">
                  <Button variant="link" className="p-0 h-auto">
                    Book this rental <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Outdoor Pavilion */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <img 
                src="https://images.unsplash.com/photo-1576437630647-e9fdd0194b0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400" 
                alt="Outdoor Pavilion" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Outdoor Pavilion</h3>
                <p className="text-gray-700 mb-4">
                  Covered outdoor pavilion with picnic tables, perfect for family gatherings, BBQs, and outdoor celebrations.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Capacity: 50</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Picnic Tables</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">BBQ Grills</span>
                </div>
                <Link href="/booking">
                  <Button variant="link" className="p-0 h-auto">
                    Book this rental <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/rooms">
              <Button>
                View All Rentals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to book a space or support our center?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Whether you're planning an event or want to contribute to our community center's growth, 
            we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-blue-50">
                Book a Rental
              </Button>
            </Link>
            <Link href="/fundraising">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-primary/10">
                Support Our Center
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

export default Home;
