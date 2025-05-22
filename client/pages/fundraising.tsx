import DonationForm from "@/components/forms/donation-form";
import FundraisingProgressBar from "@/components/fundraising/progress-bar";
import NewsletterSection from "@/components/newsletter-section";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

const Fundraising = () => {
  return (
    <>
      <Helmet>
        <title>Support Our Center | Alnwick Community Center</title>
        <meta name="description" content="Help us reach our fundraising goal for the Alnwick Community Center building remodel in Maryville, TN. Your donation supports critical updates to continue serving our community." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Building Remodel Campaign</h1>
            <p className="text-xl text-gray-700 mb-4">
              Help us reach our goal to renovate and improve our facilities for the community. Alnwick Community Center 
              needs major updates, including Audio/Visual equipment and critical structural repairs.
            </p>
            <p className="text-lg text-gray-700 mb-8"><span className="font-medium">Open Monday - Sunday, 9am - 10pm</span></p>
          </div>
        </div>
      </section>
      
      {/* Fundraising Main Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-blue-50 rounded-xl p-6 md:p-10 shadow-md max-w-4xl mx-auto">
            <FundraisingProgressBar className="mb-8" />
            
            <div className="md:flex gap-8 items-start">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h2 className="text-xl font-bold mb-3">Your Support Makes a Difference</h2>
                <p className="text-gray-700 mb-4">
                  The Alnwick Community Center in Maryville, TN has served our community for over 35 years. Our building needs critical updates to continue providing safe, accessible spaces for everyone.
                </p>
                <p className="text-gray-700 mb-4">Your donation will help us:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
                  <li>Install Audio/Visual equipment throughout the facility</li>
                  <li>Complete necessary building structural repairs</li>
                  <li>Renovate our Main Hall with updated lighting and sound systems</li>
                  <li>Create an accessible entrance and restroom facilities</li>
                  <li>Upgrade the heating and cooling systems for energy efficiency</li>
                  <li>Modernize the kitchen equipment for community meals and classes</li>
                  <li>Enhance outdoor gathering spaces for all-season use</li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                  <p className="font-medium text-yellow-800">
                    As a 501(c)(3) nonprofit organization, all donations are tax-deductible. Tax ID: 92-1085931
                  </p>
                </div>
              </div>
              
              <div className="md:w-1/2 bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Make a Donation</h2>
                <DonationForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Donor Recognition */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Donor Recognition</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Recognition Levels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-primary font-bold text-xl mb-2">Community Partner</div>
                  <div className="text-gray-800 font-bold mb-1">$500 - $999</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Name on donor wall</li>
                    <li>• Recognition in newsletter</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 text-center bg-blue-50 border-blue-200">
                  <div className="text-primary font-bold text-xl mb-2">Sustaining Supporter</div>
                  <div className="text-gray-800 font-bold mb-1">$1,000 - $4,999</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Name on donor wall</li>
                    <li>• Recognition in newsletter</li>
                    <li>• Invitation to donor events</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-primary font-bold text-xl mb-2">Cornerstone Circle</div>
                  <div className="text-gray-800 font-bold mb-1">$5,000+</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Prominent recognition on donor wall</li>
                    <li>• Featured in newsletter</li>
                    <li>• Invitation to donor events</li>
                    <li>• Naming opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Ways to Give</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-2">One-time Donations</h4>
                  <p className="text-gray-700 mb-3">
                    Make a single contribution of any amount to support our building campaign.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Online through our secure donation form</li>
                    <li>• By check mailed to our center</li>
                    <li>• In person at our front desk</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-2">Monthly Giving</h4>
                  <p className="text-gray-700 mb-3">
                    Join our sustaining donors with a convenient monthly contribution.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Easy automatic payments</li>
                    <li>• Adjust or cancel anytime</li>
                    <li>• Special recognition for recurring donors</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-2">Corporate Matching</h4>
                  <p className="text-gray-700 mb-3">
                    Many employers match charitable donations made by their employees.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Check with your employer about matching programs</li>
                    <li>• We can provide necessary documentation</li>
                    <li>• Double your impact at no extra cost to you</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-2">Legacy Giving</h4>
                  <p className="text-gray-700 mb-3">
                    Create a lasting impact by including our center in your estate planning.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Bequests and planned gifts</li>
                    <li>• Memorial and tribute donations</li>
                    <li>• Endowment opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Campaign Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Campaign Timeline</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative border-l-4 border-primary pl-8 pb-8">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px]"></div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Phase 1: Planning and Fundraising</h3>
                <p className="text-sm text-primary font-medium mb-2">January - December 2025</p>
                <p className="text-gray-700">
                  Alnwick Community Center needs major updates. This fundraising campaign is to renovate the facility
                  to better serve public needs. We need Audio/Visual equipment and building structural repairs,
                  among other critical improvements. Our goal is to raise $250,000 by the end of the year.
                </p>
              </div>
            </div>
            
            <div className="relative border-l-4 border-primary pl-8 pb-8">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px]"></div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Phase 2: Accessibility Improvements</h3>
                <p className="text-sm text-primary font-medium mb-2">January - April 2026</p>
                <p className="text-gray-700">
                  Construction of accessible entrance, renovation of restrooms, and installation of elevator.
                  This phase ensures our center is welcoming to all community members.
                </p>
              </div>
            </div>
            
            <div className="relative border-l-4 border-primary pl-8 pb-8">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px]"></div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Phase 3: Main Hall and Kitchen Renovation</h3>
                <p className="text-sm text-primary font-medium mb-2">May - August 2026</p>
                <p className="text-gray-700">
                  Updating our Main Hall with new flooring, lighting, sound system, and stage area.
                  Modernizing kitchen equipment and expanding food preparation areas.
                </p>
              </div>
            </div>
            
            <div className="relative border-l-4 border-primary pl-8 pb-8">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px]"></div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Phase 4: Energy Efficiency and Outdoor Spaces</h3>
                <p className="text-sm text-primary font-medium mb-2">September - December 2026</p>
                <p className="text-gray-700">
                  Upgrading heating and cooling systems, improving insulation, and installing energy-efficient lighting.
                  Creating accessible outdoor gathering areas with seating, shade, and garden spaces.
                </p>
              </div>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[10px]"></div>
              <div>
                <h3 className="text-xl font-bold mb-1">Grand Reopening Celebration</h3>
                <p className="text-sm text-primary font-medium mb-2">January 2027</p>
                <p className="text-gray-700">
                  Community-wide celebration of our newly renovated center, showcasing all improvements
                  and thanking our generous donors and supporters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Help Us Reach Our Goal</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100">
            Your contribution of any amount will make a difference in our community's future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/fundraising">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-blue-50">
                Donate Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-primary/10">
                Contact Us About Giving
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

export default Fundraising;
