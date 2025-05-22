import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
              AC
            </div>
            <div>
              <Link href="/" className="text-xl font-bold text-primary block">
                Alnwick Community Center
              </Link>
              <p className="text-xs text-gray-500">Bringing our community together</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
                <NavigationMenuItem>
                  <Link href="/about">
                    <NavigationMenuLink className={cn(
                      "px-3 py-2 hover:text-primary transition cursor-pointer text-base",
                      location === "/about" && "text-primary font-medium"
                    )}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(
                    "px-3 py-2 hover:text-primary transition text-base",
                    (location === "/rentals" || location === "/booking") && "text-primary font-medium"
                  )}>
                    Rentals
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <li>
                        <Link href="/rentals">
                          <NavigationMenuLink className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}>
                            <div className="text-sm font-medium">View All Rentals</div>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link href="/booking">
                          <NavigationMenuLink className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}>
                            <div className="text-sm font-medium">Book a Rental</div>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/events">
                    <NavigationMenuLink className={cn(
                      "px-3 py-2 hover:text-primary transition cursor-pointer text-base",
                      location === "/events" && "text-primary font-medium"
                    )}>
                      Events
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/fundraising">
                    <NavigationMenuLink className={cn(
                      "px-3 py-2 hover:text-primary transition cursor-pointer text-base",
                      location === "/fundraising" && "text-primary font-medium"
                    )}>
                      Fundraising
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/contact">
                    <NavigationMenuLink className={cn(
                      "px-3 py-2 hover:text-primary transition cursor-pointer text-base",
                      location === "/contact" && "text-primary font-medium"
                    )}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                

              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/fundraising">
              <Button variant="default">Donate</Button>
            </Link>
            <Link href="/booking">
              <Button variant="default" className="bg-[#059669] hover:bg-[#047857]">Book a Rental</Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <Link href="/about" className="block py-2 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/rentals" className="block py-2 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Rentals
            </Link>
            <Link href="/booking" className="block py-2 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Book a Rental
            </Link>
            <Link href="/events" className="block py-2 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Events
            </Link>
            <Link href="/fundraising" className="block py-2 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Fundraising
            </Link>
            <Link href="/contact" className="block py-2 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
            <div className="flex space-x-2 mt-3">
              <Link href="/fundraising">
                <Button className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>Donate</Button>
              </Link>
              <Link href="/booking">
                <Button className="flex-1 bg-[#059669] hover:bg-[#047857]" onClick={() => setIsMobileMenuOpen(false)}>Book a Rental</Button>
              </Link>
            </div>
            <div className="mt-3">
              <Link href="/auth">
                <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Login</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
