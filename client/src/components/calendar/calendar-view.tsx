import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit, Plus, X } from "lucide-react";
import { Event } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Convert 24-hour time format (HH:MM) to 12-hour AM/PM format
const formatTime = (time: string) => {
  if (!time) return '';
  
  // Extract hours and minutes from the time string
  const [hoursStr, minutes] = time.split(':');
  const hours = parseInt(hoursStr, 10);
  
  if (isNaN(hours)) return time;
  
  // Determine AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';
  
  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes} ${period}`;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Classes":
      return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-l-4 border-blue-500";
    case "Activities":
      return "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-l-4 border-green-500";
    case "Meetings":
      return "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-l-4 border-red-500";
    case "Community Events":
      return "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border-l-4 border-purple-500";
    case "Entertainment":
      return "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-l-4 border-amber-500";
    default:
      return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-l-4 border-gray-500";
  }
};

interface CalendarViewProps {
  isAdminView?: boolean;
  onEditEvent?: (event: Event) => void;
  onAddEvent?: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  isAdminView = false, 
  onEditEvent,
  onAddEvent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showMoreEvents, setShowMoreEvents] = useState<{events: Event[], date: Date} | null>(null);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events', year, month],
    staleTime: 1000 * 10, // 10 seconds - keep data fresh
    refetchOnMount: 'always', // Always refetch when component mounts
  });
  
  useEffect(() => {
    // Generate calendar days for the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of week of the first day (0-6, where 0 is Sunday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Generate an array of dates for the calendar grid
    const days: Date[] = [];
    
    // Add days from previous month to fill the first week
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    // Add all days of the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to complete the last week
    const remainingDays = 42 - days.length; // 42 = 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    setCalendarDays(days);
  }, [year, month]);
  
  const prevMonth = () => {
    const newDate = new Date(year, month - 1);
    setCurrentDate(newDate);
    
    // Force refresh events for the new month
    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth();
    queryClient.invalidateQueries({ queryKey: ['/api/events', newYear, newMonth] });
  };
  
  const nextMonth = () => {
    const newDate = new Date(year, month + 1);
    setCurrentDate(newDate);
    
    // Force refresh events for the new month
    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth();
    queryClient.invalidateQueries({ queryKey: ['/api/events', newYear, newMonth] });
  };
  
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      // Fix timezone issue by parsing date parts and creating date in local timezone
      const [year, month, dayOfMonth] = event.date.split('-').map(Number);
      // Create date with local timezone (months are 0-indexed in JS Date)
      const eventDate = new Date(year, month - 1, dayOfMonth);
      
      return (
        eventDate.getFullYear() === day.getFullYear() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getDate() === day.getDate()
      );
    });
  };
  
  const renderCalendarGrid = () => {
    return (
      <div className="grid grid-cols-7 gap-px text-sm bg-black border-l border-r border-b border-black overflow-x-auto max-w-full">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === month;
          const isToday = day.toDateString() === new Date().toDateString();
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const isFirstWeek = index < 7; // First row of days
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          
          return (
            <div 
              key={index}
              className={`
                aspect-square p-1 relative overflow-hidden
                ${isCurrentMonth 
                  ? 'hover:shadow-sm bg-white' 
                  : 'bg-white'} 
                ${isToday ? 'ring-2 ring-primary ring-inset' : ''}
                ${hasEvents ? 'hover:scale-[0.98]' : ''}
                ${isFirstWeek ? 'border-t-2 border-black' : ''}
                transition-all duration-200 cursor-pointer
                min-w-[40px] md:min-w-0
              `}
              onClick={() => isAdminView && onAddEvent && onAddEvent(day)}
            >
              <div className="flex justify-between items-center mb-1">
                <div className={`
                  ${isToday ? 'font-bold text-white bg-primary rounded-full w-6 h-6 flex items-center justify-center' : ''}
                  ${!isToday && isCurrentMonth ? 'font-medium text-gray-900' : 'text-gray-500 font-light'}
                `}>
                  {isToday ? (
                    <span className="text-xs">{day.getDate()}</span>
                  ) : (
                    day.getDate()
                  )}
                </div>
                {isAdminView && isCurrentMonth && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 bg-blue-100 hover:bg-blue-200 text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddEvent && onAddEvent(day);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add event</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {hasEvents && (
                <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary mr-1 mt-1" />
              )}
              
              <div className="overflow-hidden max-h-[50px] sm:max-h-[80px]">
                {dayEvents.slice(0, 2).map((event, idx) => (
                  <div 
                    key={idx}
                    className={`
                      ${getCategoryColor(event.category)} 
                      text-[9px] sm:text-xs p-1 px-1 sm:px-2 mb-1 rounded
                      truncate flex justify-between items-center
                      hover:shadow-md transform transition-all duration-200
                      hover:translate-x-0.5 cursor-pointer group
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAdminView && onEditEvent) {
                        onEditEvent(event);
                      } else {
                        // Show event details in a dialog
                        setSelectedEvent(event);
                      }
                    }}
                  >
                    <span className="overflow-hidden text-ellipsis font-medium">{event.title}</span>
                    {isAdminView && onEditEvent && (
                      <Edit className="h-3 w-3 flex-shrink-0 ml-1" />
                    )}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div 
                    className="text-xs text-gray-600 text-center bg-gray-100 rounded py-0.5 cursor-pointer hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMoreEvents({ events: dayEvents, date: day });
                    }}
                  >
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Event Detail Dialog for Mobile
  const eventDetailDialog = (
    <Dialog open={selectedEvent !== null} onOpenChange={(open) => !open && setSelectedEvent(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{selectedEvent?.title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {selectedEvent?.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 text-sm mt-4">
          <div className="font-semibold">Time:</div>
          <div>
            {selectedEvent && formatTime(selectedEvent.startTime.slice(0, 5))} - 
            {selectedEvent && formatTime(selectedEvent.endTime.slice(0, 5))}
          </div>
          <div className="font-semibold">Room:</div>
          <div>
            {selectedEvent?.roomId === 1 ? 'Gymnasium' : 
             selectedEvent?.roomId === 2 ? 'Community Room' : 
             selectedEvent?.roomId === 3 ? 'Community Kitchen' : 
             selectedEvent?.roomId === 4 ? 'Classroom' : 'TBA'}
          </div>
          <div className="font-semibold">Category:</div>
          <div>{selectedEvent?.category}</div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // More Events Dialog for Mobile
  const moreEventsDialog = (
    <Dialog open={showMoreEvents !== null} onOpenChange={(open) => !open && setShowMoreEvents(null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            All Events - {showMoreEvents && `${monthNames[showMoreEvents.date.getMonth()]} ${showMoreEvents.date.getDate()}, ${showMoreEvents.date.getFullYear()}`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[50vh] overflow-y-auto py-2">
          {showMoreEvents?.events.map((event, idx) => (
            <div key={idx} className={`p-3 rounded-md ${getCategoryColor(event.category)}`}>
              <div className="font-bold">{event.title}</div>
              <div className="mt-1 text-gray-700">{event.description}</div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                <div className="font-semibold">Time:</div>
                <div>{formatTime(event.startTime.slice(0, 5))} - {formatTime(event.endTime.slice(0, 5))}</div>
                <div className="font-semibold">Room:</div>
                <div>
                  {event.roomId === 1 ? 'Gymnasium' : 
                   event.roomId === 2 ? 'Community Room' : 
                   event.roomId === 3 ? 'Community Kitchen' : 
                   event.roomId === 4 ? 'Classroom' : 'TBA'}
                </div>
                <div className="font-semibold">Category:</div>
                <div>{event.category}</div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderListView = () => {
    // Group events by date
    const groupedEvents: Record<string, Event[]> = {};
    
    events.forEach(event => {
      // Fix timezone issue by parsing date parts and creating date in local timezone
      const [year, month, dayOfMonth] = event.date.split('-').map(Number);
      // Create date with local timezone (months are 0-indexed in JS Date)
      const eventDate = new Date(year, month - 1, dayOfMonth);
      const dateString = eventDate.toDateString();
      
      if (!groupedEvents[dateString]) {
        groupedEvents[dateString] = [];
      }
      groupedEvents[dateString].push(event);
    });
    
    return (
      <div className="space-y-4">
        {Object.entries(groupedEvents).map(([dateString, dayEvents]) => {
          // Use the first event's date for displaying the formatted date
          const event = dayEvents[0];
          // Properly construct the date from the string parts to avoid timezone issues
          const [year, month, dayOfMonth] = event.date.split('-').map(Number);
          const eventDate = new Date(year, month - 1, dayOfMonth);
          
          return (
            <div key={dateString} className="border border-black rounded-lg p-0 overflow-hidden shadow-sm">
              <div className="flex justify-between items-center mb-0 bg-gradient-to-r from-blue-600 to-blue-700 p-3 border-b border-blue-400">
                <h3 className="font-bold text-white flex items-center">
                  <span className="inline-block h-8 w-8 bg-white text-blue-700 rounded-full mr-2 flex items-center justify-center text-sm font-bold shadow-md">
                    {eventDate.getDate()}
                  </span>
                  {eventDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </h3>
                {isAdminView && onAddEvent && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-white hover:bg-blue-50 text-blue-600 rounded-full shadow-sm"
                    onClick={() => onAddEvent(eventDate)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {dayEvents.map((event, idx) => (
                  <div 
                    key={idx}
                    onClick={() => !isAdminView && setSelectedEvent(event)}
                    className={`flex flex-col sm:flex-row items-start p-3 rounded-lg shadow-sm hover:shadow-md group transition-all duration-200 mb-2 cursor-pointer ${
                      event.category === 'Meeting' 
                        ? 'border-l-4 border-red-500 hover:bg-red-50/30'
                        : event.category === 'Activities'
                          ? 'border-l-4 border-green-500 hover:bg-green-50/30'
                          : event.category === 'Entertainment'
                            ? 'border-l-4 border-amber-500 hover:bg-amber-50/30'
                            : event.category === 'Community Events'
                              ? 'border-l-4 border-purple-500 hover:bg-purple-50/30'
                              : 'border-l-4 border-blue-500 hover:bg-blue-50/30'
                    } bg-white`}>
                    <div className={`w-full sm:w-auto sm:min-w-[70px] text-sm font-medium rounded-md px-2 py-1 text-center border mb-2 sm:mb-0 
                      ${event.category === 'Meeting' 
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : event.category === 'Activities'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : event.category === 'Entertainment'
                              ? 'bg-amber-100 text-amber-700 border-amber-200'
                              : event.category === 'Community Events'
                                ? 'bg-purple-100 text-purple-700 border-purple-200'
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                      {formatTime(event.startTime.slice(0, 5))} - {formatTime(event.endTime.slice(0, 5))}
                    </div>
                    <div className="sm:ml-3 flex-grow">
                      <div className="font-semibold text-base text-blue-900">{event.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Location: {event.roomId === 1 ? 'Gymnasium' : 
                               event.roomId === 2 ? 'Community Room' : 
                               event.roomId === 3 ? 'Community Kitchen' : 
                               event.roomId === 4 ? 'Classroom' : 'TBA'}
                      </div>
                      <Badge className={`mt-2 ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </Badge>
                    </div>
                    {isAdminView && onEditEvent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent(event);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {Object.keys(groupedEvents).length === 0 && (
          <div className="text-center py-12 border border-black rounded-lg bg-gray-50">
            <div className="text-lg font-semibold text-gray-700">No events scheduled for this month</div>
            <div className="text-sm mt-2 text-gray-500">Check back later or select a different month</div>
          </div>
        )}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <Card className="border border-black">
        <CardHeader className="border-b border-black p-4 bg-gray-50">
          <Skeleton className="h-8 w-48 mx-auto" />
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 mb-0 text-center border border-black">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-sm font-medium text-gray-500 bg-white py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-black border-l border-r border-b border-black">
            {Array(35).fill(0).map((_, i) => (
              <Skeleton key={i} className="aspect-square bg-gray-50" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Make sure the dialogs work on mobile
  return (
    <>
      {eventDetailDialog}
      {moreEventsDialog}
      
      <Card className="border border-black">
      <CardHeader className="border-b border-black p-3 sm:p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevMonth}
            className="text-gray-600 hover:text-primary"
          >
            <ChevronLeft />
          </Button>
          <h3 className="text-base sm:text-xl font-bold truncate px-1">
            {monthNames[month]} {year}
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextMonth}
            className="text-gray-600 hover:text-primary"
          >
            <ChevronRight />
          </Button>
        </div>
      </CardHeader>
      
      <div className="mb-3 sm:mb-4 p-2 sm:p-4 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm w-full sm:w-auto" role="group">
          <Button
            onClick={() => setView('calendar')}
            variant={view === 'calendar' ? 'default' : 'outline'}
            className={`text-xs sm:text-sm flex-1 sm:flex-initial ${view === 'calendar' ? '' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
          >
            Calendar
          </Button>
          <Button
            onClick={() => setView('list')}
            variant={view === 'list' ? 'default' : 'outline'}
            className={`text-xs sm:text-sm flex-1 sm:flex-initial ${view === 'list' ? '' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
          >
            List
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        {view === 'calendar' && (
          <>
            <div className="grid grid-cols-7 mb-0 text-center border border-black">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-sm font-medium text-gray-500 bg-white py-2">{day}</div>
              ))}
            </div>
            {renderCalendarGrid()}
          </>
        )}
        
        {view === 'list' && renderListView()}
      </CardContent>
      
      <CardFooter className="border-t border-black p-4 bg-blue-50 text-center text-sm">
        <div className="w-full">
          <p className="mb-2 text-blue-700 font-medium">Events are color-coded by category:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1 inline-block shadow-sm"></span>
              Classes
            </Badge>
            <Badge className="bg-green-100 text-green-800 border border-green-300">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block shadow-sm"></span>
              Activities
            </Badge>
            <Badge className="bg-red-100 text-red-800 border border-red-300">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-1 inline-block shadow-sm"></span>
              Meetings
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border border-purple-300">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-1 inline-block shadow-sm"></span>
              Community Events
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
    </>
  );
};

export default CalendarView;
