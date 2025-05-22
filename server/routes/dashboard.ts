import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { storage } from '../storage';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get user's dashboard data
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    
    // Get user engagement metrics
    const metrics = await storage.getUserEngagementMetrics(userId) || {
      userId,
      bookingsCount: 0,
      eventsAttended: 0,
      donationsCount: 0,
      totalDonationAmount: 0,
      volunteerHours: 0,
      // New engagement metrics
      communityPoints: 0,
      eventFeedbackCount: 0,
      avgEventRating: '0',
      lastEventDate: null,
      engagementStreak: 0,
      lastEngagementDate: null,
      roomPreference: null,
      activityPreference: null,
    };
    
    // Get user's bookings
    const bookings = await storage.getBookings();
    const userBookings = bookings.filter(booking => 
      booking.email === req.user.email
    );
    
    // Get user's event registrations
    const eventRegistrations = await storage.getUserEventRegistrations(userId);
    
    // Get user's volunteer hours
    const volunteerHours = await storage.getUserVolunteerHours(userId);
    
    // Get user's preferences
    const preferences = await storage.getUserPreferences(userId);
    
    // Get upcoming events for the user
    const events = await storage.getEvents();
    const currentDate = new Date();
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= currentDate;
    }).slice(0, 5); // Limit to 5 upcoming events
    
    // Calculate recent activity
    const recentBookings = userBookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 3);
    
    const recentVolunteerHours = volunteerHours.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 3);
    
    // Get event details for registrations
    const eventRegistrationsWithDetails = await Promise.all(
      eventRegistrations.map(async (registration) => {
        const event = await storage.getEventById(registration.eventId);
        return { ...registration, event };
      })
    );
    
    // Calculate personalized recommendations based on user activity
    const recommendedEvents = upcomingEvents;

    // Filter rooms based on user's room preference
    const allRooms = await storage.getRooms();
    const recommendedRooms = metrics.roomPreference 
      ? allRooms.filter(room => room.name === metrics.roomPreference)
      : allRooms.slice(0, 2);  // Default to first 2 rooms if no preference
    
    // Generate activity recommendations based on past events
    const allEvents = await storage.getEvents();
    const eventTypes = new Set(allEvents.map(event => event.category));
    const recommendedActivities = Array.from(eventTypes).slice(0, 3);
    
    // Generate user engagement statistics
    let frequentActivities: { name: string, count: number }[] = [];
    if (eventRegistrations.length > 0) {
      // Count event categories
      const activityCounts = eventRegistrationsWithDetails.reduce((acc, reg) => {
        const eventCategory = reg.event?.category || 'Unknown';
        acc[eventCategory] = (acc[eventCategory] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Convert to array and sort
      frequentActivities = Object.entries(activityCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }
    
    // Generate participation by month
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    // Initialize months
    const months: { month: string, count: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      months.unshift({
        month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
        count: 0
      });
    }
    
    // Count events by month
    eventRegistrationsWithDetails.forEach(reg => {
      if (!reg.event?.date) return;
      
      const eventDate = new Date(reg.event.date);
      if (eventDate >= sixMonthsAgo) {
        const monthKey = eventDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        const monthEntry = months.find(m => m.month === monthKey);
        if (monthEntry) {
          monthEntry.count++;
        }
      }
    });
    
    // Calculate volunteer impact data
    const volunteerImpact = {
      hours: metrics.volunteerHours || 0,
      peopleImpacted: Math.round((metrics.volunteerHours || 0) * 2.5) // Estimate impact based on hours
    };
    
    return res.status(200).json({
      success: true,
      dashboard: {
        metrics,
        preferences: preferences?.preferences || {},
        upcomingEvents,
        recentBookings,
        recentVolunteerHours,
        eventRegistrations: eventRegistrationsWithDetails,
        // New personalized recommendations
        recommendations: {
          events: recommendedEvents,
          rooms: recommendedRooms,
          activities: recommendedActivities.map(activity => ({ name: activity }))
        },
        // User engagement statistics 
        statistics: {
          frequentActivities,
          participationByMonth: months,
          volunteerImpact
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard data',
    });
  }
});

// Update user preferences
router.post('/preferences', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { preferences } = req.body;
    
    if (!preferences) {
      return res.status(400).json({
        success: false,
        message: 'Preferences data is required',
      });
    }
    
    const updatedPreferences = await storage.updateUserPreferences(userId, { preferences });
    
    return res.status(200).json({
      success: true,
      preferences: updatedPreferences,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating preferences',
    });
  }
});

// Record volunteer hours
router.post('/volunteer', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { eventId, hoursLogged, activityDescription, date } = req.body;
    
    if (!hoursLogged || !activityDescription || !date) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    
    const volunteerHours = await storage.createUserVolunteerHours({
      userId,
      eventId: eventId || null,
      hoursLogged,
      activityDescription,
      date,
      verifiedBy: null,
    });
    
    // Update metrics
    const metrics = await storage.getUserEngagementMetrics(userId);
    if (metrics) {
      await storage.createOrUpdateUserEngagementMetrics({
        ...metrics,
        volunteerHours: metrics.volunteerHours + hoursLogged,
      });
    }
    
    return res.status(201).json({
      success: true,
      volunteerHours,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error recording volunteer hours',
    });
  }
});

// Register for an event
router.post('/events/register', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { eventId } = req.body;
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }
    
    // Check if the event exists
    const event = await storage.getEventById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    // Check if already registered
    const registrations = await storage.getUserEventRegistrations(userId);
    const alreadyRegistered = registrations.some(r => r.eventId === eventId);
    
    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event',
      });
    }
    
    // Register for the event
    const registration = await storage.createUserEventRegistration({
      userId,
      eventId,
      status: 'registered',
      attended: false,
      feedback: null,
      rating: null,
    });
    
    return res.status(201).json({
      success: true,
      registration,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error registering for event',
    });
  }
});

// Get all user event registrations
router.get('/events/registrations', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const registrations = await storage.getUserEventRegistrations(userId);
    
    // Get event details for each registration
    const registrationsWithEvents = await Promise.all(
      registrations.map(async (registration) => {
        const event = await storage.getEventById(registration.eventId);
        return { ...registration, event };
      })
    );
    
    return res.status(200).json({
      success: true,
      registrations: registrationsWithEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving event registrations',
    });
  }
});

// Submit event feedback
router.post('/events/:eventId/feedback', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const eventId = parseInt(req.params.eventId);
    const { feedback, rating, attended } = req.body;
    
    // Update registration
    const updatedRegistration = await storage.updateUserEventRegistration(userId, eventId, {
      feedback,
      rating: rating ? parseInt(rating) : null,
      attended: attended === true,
    });
    
    if (!updatedRegistration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }
    
    // If marked as attended, update metrics
    if (attended && !updatedRegistration.attended) {
      const metrics = await storage.getUserEngagementMetrics(userId);
      if (metrics) {
        await storage.createOrUpdateUserEngagementMetrics({
          ...metrics,
          eventsAttended: metrics.eventsAttended + 1,
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      registration: updatedRegistration,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
    });
  }
});

export default router;