import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Room } from "@shared/schema";
import { ArrowRight } from "lucide-react";

interface RoomCardProps {
  room: Room;
}

const RoomCard = ({ room }: RoomCardProps) => {
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{room.name}</h3>
        <p className="text-gray-700 mb-4">{room.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Capacity: {room.capacity}
          </Badge>
          {room.features.map((feature, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={feature === "Local Pricing" 
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200" 
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"}
            >
              {feature}
            </Badge>
          ))}
        </div>
        {room.hourlyRate === 0 && (
          <p className="text-amber-700 font-medium text-sm mt-1 mb-2">
            Available for booking - Pricing TBA
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href="/booking">
          <Button variant="link" className="text-primary font-medium p-0 h-auto">
            Book this rental <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
