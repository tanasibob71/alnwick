import { Link } from "wouter";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                AC
              </div>
              <div>
                <h3 className="font-bold">Alnwick</h3>
                <p className="text-xs text-gray-400">Community Center</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">A 501(c)(3) nonprofit organization dedicated to serving the Maryville, TN community since 1985.</p>
            <p className="text-gray-400 text-sm">Tax ID: 92-1085931</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about"><a className="hover:text-white transition">About Us</a></Link></li>
              <li><Link href="/rooms"><a className="hover:text-white transition">Rentals</a></Link></li>
              <li><Link href="/events"><a className="hover:text-white transition">Events Calendar</a></Link></li>
              <li><Link href="/booking"><a className="hover:text-white transition">Rental Booking</a></Link></li>
              <li><Link href="/fundraising"><a className="hover:text-white transition">Support Our Center</a></Link></li>
              <li><a href="#" className="hover:text-white transition">COVID-19 Guidelines</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Youth Activities</a></li>
              <li><a href="#" className="hover:text-white transition">Senior Programs</a></li>
              <li><a href="#" className="hover:text-white transition">Community Classes</a></li>
              <li><a href="#" className="hover:text-white transition">Volunteer Opportunities</a></li>
              <li><a href="#" className="hover:text-white transition">Support Groups</a></li>
              <li><a href="#" className="hover:text-white transition">Special Events</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <span>2146 Big Springs Road, Maryville, TN 37801</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <span>865-257-2122</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <span>alnwickcommunityc@gmail.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                <span>Monday - Sunday: 9am - 10pm</span>
              </li>
            </ul>
            <div className="mt-4 flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Alnwick Community Center. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
