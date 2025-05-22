import {
  rooms, Room, InsertRoom,
  bookings, Booking, InsertBooking,
  events, Event, InsertEvent,
  donations, Donation, InsertDonation,
  contactMessages, ContactMessage, InsertContactMessage,
  newsletterSubscribers, NewsletterSubscriber, InsertNewsletterSubscriber,
  users, User, InsertUser,
  userEngagementMetrics, UserEngagementMetrics, InsertUserEngagementMetrics,
  userEventRegistrations, UserEventRegistration, InsertUserEventRegistration,
  userVolunteerHours, UserVolunteerHours, InsertUserVolunteerHours,
  userPreferences, UserPreferences, InsertUserPreferences,
  siteImages, SiteImage, InsertSiteImage
} from "@shared/schema";

export interface IStorage {
  // Room operations
  getRooms(): Promise<Room[]>;
  getRoomById(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;

  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsByDate(date: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  getEventsByMonth(year: number, month: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: InsertEvent): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Donation operations
  getDonations(): Promise<Donation[]>;
  getTotalDonationAmount(): Promise<number>;
  createDonation(donation: InsertDonation): Promise<Donation>;

  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;

  // Newsletter subscriber operations
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  isEmailSubscribed(email: string): Promise<boolean>;
  deleteNewsletterSubscriber(id: number): Promise<boolean>;

  // User operations
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // User engagement metrics operations
  getUserEngagementMetrics(userId: number): Promise<UserEngagementMetrics | undefined>;
  createOrUpdateUserEngagementMetrics(metrics: InsertUserEngagementMetrics | Partial<UserEngagementMetrics>): Promise<UserEngagementMetrics>;

  // User event registrations operations
  getUserEventRegistrations(userId: number): Promise<UserEventRegistration[]>;
  createUserEventRegistration(registration: InsertUserEventRegistration): Promise<UserEventRegistration>;
  updateUserEventRegistration(userId: number, eventId: number, data: Partial<UserEventRegistration>): Promise<UserEventRegistration | undefined>;

  // User volunteer hours operations
  getUserVolunteerHours(userId: number): Promise<UserVolunteerHours[]>;
  createUserVolunteerHours(volunteerHours: InsertUserVolunteerHours): Promise<UserVolunteerHours>;
  
  // User preferences operations
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  updateUserPreferences(userId: number, preferences: Partial<UserPreferences>): Promise<UserPreferences | undefined>;
  
  // Site images operations
  getSiteImages(): Promise<SiteImage[]>;
  getSiteImageById(id: number): Promise<SiteImage | undefined>;
  getSiteImagesByCategory(category: string): Promise<SiteImage[]>;
  createSiteImage(siteImage: InsertSiteImage): Promise<SiteImage>;
  updateSiteImage(id: number, siteImageData: Partial<SiteImage>): Promise<SiteImage | undefined>;
  deleteSiteImage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private rooms: Map<number, Room>;
  private bookings: Map<number, Booking>;
  private events: Map<number, Event>;
  private donations: Map<number, Donation>;
  private contactMessages: Map<number, ContactMessage>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  private users: Map<number, User>;
  private userEngagementMetrics: Map<number, UserEngagementMetrics>;
  private userEventRegistrations: Map<string, UserEventRegistration>;
  private userVolunteerHours: Map<number, UserVolunteerHours>;
  private userPreferences: Map<number, UserPreferences>;
  private siteImages: Map<number, SiteImage>;
  
  private roomId: number;
  private bookingId: number;
  private eventId: number;
  private donationId: number;
  private contactMessageId: number;
  private newsletterSubscriberId: number;
  private userId: number;
  private userEngagementMetricsId: number;
  private userVolunteerHoursId: number;
  private siteImageId: number;

  constructor() {
    this.rooms = new Map();
    this.bookings = new Map();
    this.events = new Map();
    this.donations = new Map();
    this.contactMessages = new Map();
    this.newsletterSubscribers = new Map();
    this.users = new Map();
    this.userEngagementMetrics = new Map();
    this.userEventRegistrations = new Map();
    this.userVolunteerHours = new Map();
    this.userPreferences = new Map();
    this.siteImages = new Map();
    
    this.roomId = 1;
    this.bookingId = 1;
    this.eventId = 1;
    this.donationId = 1;
    this.contactMessageId = 1;
    this.newsletterSubscriberId = 1;
    this.userId = 1;
    this.userEngagementMetricsId = 1;
    this.userVolunteerHoursId = 1;
    this.siteImageId = 1;
    
    // Initialize with sample rooms
    this.initializeRooms();
    // Initialize with sample events
    this.initializeEvents();
    // Initialize with some sample users
    this.initializeUsers();
    
    // Remove classrooms B-D if they exist
    this.removeUnwantedClassrooms();
  }
  
  // Function to remove classrooms B, C, and D
  private removeUnwantedClassrooms() {
    const unwantedClassrooms = ["Classroom B", "Classroom C", "Classroom D"];
    
    // Filter out unwanted classrooms
    const allRooms = Array.from(this.rooms.entries());
    for (const [id, room] of allRooms) {
      if (unwantedClassrooms.includes(room.name)) {
        this.rooms.delete(id);
      }
    }
    
    // Update any event references to use Classroom (id 4)
    const allEvents = Array.from(this.events.entries());
    allEvents.forEach(([eventId, event]) => {
      if (!this.rooms.has(event.roomId)) {
        const updatedEvent = { ...event, roomId: 4 };
        this.events.set(eventId, updatedEvent);
      }
    });
  }
  
  // Initialize sample users
  private initializeUsers() {
    const sampleUsers: InsertUser[] = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123", // In real app, would be hashed
        role: "user",
      },
      {
        name: "Admin User",
        email: "tanasibob71@gmail.com",
        password: "sunnygadfly935", // In real app, would be hashed
        role: "admin",
      },
    ];
    
    sampleUsers.forEach(user => this.createUser(user));
  }

  // Initialize sample rooms
  private initializeRooms() {
    const sampleRooms: InsertRoom[] = [
      {
        name: "Gymnasium",
        description: "Our largest space, perfect for community events, performances, basketball games, and large gatherings. Features a stage for music and playwrite performances, plus a full basketball court for sports activities. Can accommodate up to 200 people.",
        capacity: 200,
        hourlyRate: 40,
        halfDayRate: 120,
        fullDayRate: 250,
        features: ["Stage", "Tables and Chairs", "Basketball Court"],
        imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Community Room",
        description: "Versatile space perfect for gatherings, celebrations, and entertainment events. Features a stage for music and karaoke performances.",
        capacity: 50,
        hourlyRate: 30,
        halfDayRate: 100,
        fullDayRate: 180,
        features: ["Stage", "Sound System", "Flexible Seating"],
        imageUrl: "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Community Kitchen",
        description: "Fully equipped kitchen available for cooking classes, community meals, and event catering preparation.",
        capacity: 5,
        hourlyRate: 10,
        halfDayRate: 40,
        fullDayRate: 80,
        features: ["Appliances", "Prep Area"],
        imageUrl: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        name: "Classroom",
        description: "Versatile classroom space ideal for educational workshops, training sessions, and small group activities.",
        capacity: 30,
        hourlyRate: 25,
        halfDayRate: 100,
        fullDayRate: 180,
        features: ["Flexible Seating"],
        imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Baseball Field",
        description: "Regulation-sized baseball field with dugouts, perfect for baseball and softball games, practices, and tournaments. Can be rented for league play or individual events. Pricing will be determined locally at time of booking.",
        capacity: 100,
        hourlyRate: 0,
        halfDayRate: 0,
        fullDayRate: 0,
        features: ["Dugouts", "Lighting", "Bleacher Seating", "Local Pricing"],
        imageUrl: "/images/baseball-youth.jpg",
      },
      {
        name: "Soccer Field",
        description: "Well-maintained soccer field suitable for matches, practices, and sports events. Features goal posts, corner flags, and open space for various uses. Pricing will be determined locally at time of booking.",
        capacity: 150,
        hourlyRate: 0,
        halfDayRate: 0,
        fullDayRate: 0,
        features: ["Goal Posts", "Lighting", "Field Markings", "Local Pricing"],
        imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Outdoor Pavilion",
        description: "Covered outdoor pavilion with picnic tables, perfect for family gatherings, BBQs, and outdoor celebrations in a protected environment. Pricing will be determined locally at time of booking.",
        capacity: 50,
        hourlyRate: 0,
        halfDayRate: 0,
        fullDayRate: 0,
        features: ["Covered Area", "Picnic Tables", "BBQ Grills", "Local Pricing"],
        imageUrl: "/images/pavilion.jpg",
      },
    ];

    sampleRooms.forEach(room => this.createRoom(room));
  }

  // Initialize sample events
  private initializeEvents() {
    const events: InsertEvent[] = [];
    const year = 2025; // Setting fixed year to 2025 as mentioned in the context

    // Generate events for all 12 months
    for (let month = 0; month < 12; month++) {
      // Find the first day of the month
      const firstDay = new Date(year, month, 1);
      const firstDayOfWeek = firstDay.getDay(); // 0 (Sunday) through 6 (Saturday)
      
      // Calculate days until first Friday (5 = Friday)
      const daysUntilFriday = firstDayOfWeek <= 5 ? 
                              5 - firstDayOfWeek : // If first day is before Friday
                              5 + (7 - firstDayOfWeek); // If first day is after Friday
                              
      const firstFriday = new Date(year, month, 1 + daysUntilFriday);
      
      // Calculate all Fridays in the month
      const fridays: Date[] = [];
      let currentFriday = new Date(firstFriday);
      
      while (currentFriday.getMonth() === month) {
        fridays.push(new Date(currentFriday));
        currentFriday.setDate(currentFriday.getDate() + 7);
      }
      
      // Find the second Thursday of the month (4 = Thursday)
      const daysUntilThursday = firstDayOfWeek <= 4 ? 
                               4 - firstDayOfWeek : // If first day is before Thursday
                               4 + (7 - firstDayOfWeek); // If first day is after Thursday
                                
      const firstThursday = new Date(year, month, 1 + daysUntilThursday);
      // Then add 7 days to get to the second Thursday
      const secondThursday = new Date(firstThursday);
      secondThursday.setDate(secondThursday.getDate() + 7);
      const secondThursdayStr = secondThursday.toISOString().split('T')[0];
      
      // Add the board meeting on the second Thursday 5-6pm
      events.push({
        title: "Alnwick Board Meeting",
        description: "Monthly board meeting for the Alnwick Community Center in the Community Room. Community members are welcome to attend.",
        date: secondThursdayStr,
        startTime: "17:00", // 5:00 PM
        endTime: "18:00",   // 6:00 PM
        roomId: 2,          // Community Room
        category: "Meetings",
      });
      
      fridays.forEach(friday => {
        const dateStr = friday.toISOString().split('T')[0];
        
        // Borderline Band dance in Gymnasium
        events.push({
          title: "Borderline Band Dance",
          description: "Join us for live music and dancing with the Borderline Band in our Gymnasium. All ages welcome.",
          date: dateStr,
          startTime: "18:00", // 6:00 PM
          endTime: "22:00",   // 10:00 PM
          roomId: 1,          // Gymnasium
          category: "Activities",
        });
        
        // New Sounds Karaoke in Community Room
        events.push({
          title: "New Sounds Karaoke",
          description: "Enjoy an evening of karaoke with New Sounds in the Community Room. Sing your favorite songs in a fun, supportive environment.",
          date: dateStr,
          startTime: "19:00", // 7:00 PM
          endTime: "22:00",   // 10:00 PM
          roomId: 2,          // Community Room
          category: "Activities",
        });
      });
    }

    // Add some additional unique events spread throughout the year
    events.push({
      title: "Community Garage Sale",
      description: "Annual community garage sale fundraiser. Come find treasures and support your community center!",
      date: `${year}-06-21`, // June 21 (Saturday)
      startTime: "08:00", // 8:00 AM
      endTime: "16:00",   // 4:00 PM
      roomId: 1,          // Gymnasium
      category: "Community Events",
    });
    
    // Add BINGO night on June 7
    events.push({
      title: "BINGO Night Fundraiser",
      description: "Join us for a fun evening of BINGO with prizes! $5 per card, all proceeds support building renovations. All ages welcome.",
      date: `${year}-06-07`, // June 7
      startTime: "18:00", // 6:00 PM
      endTime: "20:00",   // 8:00 PM
      roomId: 1,          // Gymnasium
      category: "Community Events",
    });

    events.push({
      title: "Summer Concert Series",
      description: "Outdoor concert featuring local musicians. Bring lawn chairs and enjoy the music!",
      date: `${year}-07-20`, // July 20
      startTime: "17:00", // 5:00 PM
      endTime: "21:00",   // 9:00 PM
      roomId: 1,          // Gymnasium
      category: "Entertainment",
    });

    events.push({
      title: "Thanksgiving Potluck",
      description: "Annual community Thanksgiving potluck dinner. Bring a dish to share!",
      date: `${year}-11-22`, // November before Thanksgiving
      startTime: "17:00", // 5:00 PM
      endTime: "20:00",   // 8:00 PM
      roomId: 2,          // Community Room
      category: "Community Events",
    });

    events.push({
      title: "Holiday Craft Fair",
      description: "Annual holiday craft fair featuring local artisans. Perfect for gift shopping!",
      date: `${year}-12-08`, // December 8
      startTime: "10:00", // 10:00 AM
      endTime: "16:00",   // 4:00 PM
      roomId: 1,          // Gymnasium
      category: "Community Events",
    });

    events.forEach((event: InsertEvent) => this.createEvent(event));
  }

  // Room operations
  async getRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoomById(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const id = this.roomId++;
    const newRoom: Room = { ...room, id };
    this.rooms.set(id, newRoom);
    return newRoom;
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByDate(date: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.date === date
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const newBooking: Booking = {
      ...booking,
      id,
      description: booking.description || null,
      organization: booking.organization || null,
      eventImage: booking.eventImage || null,
      timeSlot: booking.timeSlot || null,
      startTime: booking.startTime || null,
      endTime: booking.endTime || null,
      status: "pending",
      createdAt: new Date(),
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking: Booking = {
      ...booking,
      status,
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByMonth(year: number, month: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: number, eventData: InsertEvent): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) {
      return undefined;
    }

    const updatedEvent: Event = {
      ...existingEvent,
      ...eventData,
      id // Ensure id doesn't change
    };

    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const exists = this.events.has(id);
    if (!exists) {
      return false;
    }
    this.events.delete(id);
    return true;
  }

  // Donation operations
  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }

  async getTotalDonationAmount(): Promise<number> {
    return Array.from(this.donations.values()).reduce((sum, donation) => sum + donation.amount, 0);
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const id = this.donationId++;
    const newDonation: Donation = {
      ...donation,
      id,
      message: donation.message || null,
      imageUrl: donation.imageUrl || null,
      isRecurring: donation.isRecurring || false,
      isAnonymous: donation.isAnonymous || false,
      createdAt: new Date(),
    };
    this.donations.set(id, newDonation);
    return newDonation;
  }

  // Contact message operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageId++;
    const newMessage: ContactMessage = {
      ...message,
      id,
      attachments: message.attachments || null,
      subscribeToNewsletter: message.subscribeToNewsletter || false,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, newMessage);
    
    // If user wants to subscribe to newsletter, add them
    if (newMessage.subscribeToNewsletter) {
      await this.addNewsletterSubscriberIfNotExists({ email: message.email });
    }
    
    return newMessage;
  }
  
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  // Newsletter subscriber operations
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values());
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.newsletterSubscriberId++;
    const newSubscriber: NewsletterSubscriber = {
      ...subscriber,
      id,
      createdAt: new Date(),
    };
    this.newsletterSubscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    return Array.from(this.newsletterSubscribers.values()).some(
      subscriber => subscriber.email === email
    );
  }
  
  async deleteNewsletterSubscriber(id: number): Promise<boolean> {
    const subscriber = this.newsletterSubscribers.get(id);
    if (!subscriber) {
      return false;
    }
    
    this.newsletterSubscribers.delete(id);
    return true;
  }

  private async addNewsletterSubscriberIfNotExists(subscriber: InsertNewsletterSubscriber): Promise<void> {
    const isSubscribed = await this.isEmailSubscribed(subscriber.email);
    if (!isSubscribed) {
      await this.createNewsletterSubscriber(subscriber);
    }
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log(`Looking for user with email: ${email}`);
    
    // Log all users in the system for debugging
    const allUsers = Array.from(this.users.values());
    console.log(`Available users in the system:`, allUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })));
    
    return allUsers.find(user => {
      console.log(`Comparing ${user.email} with ${email}`);
      return user.email === email;
    });
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = {
      ...user,
      id,
      role: user.role || "user", // Ensure role has a default
      createdAt: new Date(),
      lastLoginAt: null,
      profilePictureUrl: null,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...userData,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const exists = this.users.has(id);
    if (!exists) return false;
    
    return this.users.delete(id);
  }

  // User engagement metrics operations
  async getUserEngagementMetrics(userId: number): Promise<UserEngagementMetrics | undefined> {
    return Array.from(this.userEngagementMetrics.values()).find(metrics => metrics.userId === userId);
  }

  async createOrUpdateUserEngagementMetrics(metricsData: InsertUserEngagementMetrics | Partial<UserEngagementMetrics>): Promise<UserEngagementMetrics> {
    // Ensure userId is available and valid
    if (!('userId' in metricsData) || typeof metricsData.userId !== 'number') {
      throw new Error('Valid userId is required for user engagement metrics');
    }
    
    const existingMetrics = await this.getUserEngagementMetrics(metricsData.userId);
    
    if (existingMetrics) {
      // Update existing metrics
      const updatedMetrics: UserEngagementMetrics = {
        ...existingMetrics,
        ...('id' in metricsData ? { ...metricsData, id: existingMetrics.id } : metricsData),
        lastUpdated: new Date(),
      };
      this.userEngagementMetrics.set(existingMetrics.id, updatedMetrics);
      return updatedMetrics;
    } else {
      // Create new metrics
      const id = this.userEngagementMetricsId++;
      const userId = metricsData.userId;
      // Create a safe metrics object with default values
      const newMetrics: UserEngagementMetrics = {
        id,
        userId,
        bookingsCount: 0,
        eventsAttended: 0,
        donationsCount: 0,
        totalDonationAmount: 0,
        volunteerHours: 0,
        communityPoints: 0,
        eventFeedbackCount: 0,
        avgEventRating: '0',
        lastEventDate: null,
        engagementStreak: 0,
        lastEngagementDate: null,
        roomPreference: null,
        activityPreference: null,
        lastUpdated: new Date(),
      };
      
      // Apply any provided values from metricsData
      if ('bookingsCount' in metricsData && typeof metricsData.bookingsCount === 'number') {
        newMetrics.bookingsCount = metricsData.bookingsCount;
      }
      if ('eventsAttended' in metricsData && typeof metricsData.eventsAttended === 'number') {
        newMetrics.eventsAttended = metricsData.eventsAttended;
      }
      if ('donationsCount' in metricsData && typeof metricsData.donationsCount === 'number') {
        newMetrics.donationsCount = metricsData.donationsCount;
      }
      if ('totalDonationAmount' in metricsData && typeof metricsData.totalDonationAmount === 'number') {
        newMetrics.totalDonationAmount = metricsData.totalDonationAmount;
      }
      if ('volunteerHours' in metricsData && typeof metricsData.volunteerHours === 'number') {
        newMetrics.volunteerHours = metricsData.volunteerHours;
      }
      
      // Handle new engagement metrics
      if ('communityPoints' in metricsData && typeof metricsData.communityPoints === 'number') {
        newMetrics.communityPoints = metricsData.communityPoints;
      }
      if ('eventFeedbackCount' in metricsData && typeof metricsData.eventFeedbackCount === 'number') {
        newMetrics.eventFeedbackCount = metricsData.eventFeedbackCount;
      }
      if ('avgEventRating' in metricsData) {
        newMetrics.avgEventRating = String(metricsData.avgEventRating);
      }
      if ('lastEventDate' in metricsData && metricsData.lastEventDate) {
        newMetrics.lastEventDate = metricsData.lastEventDate instanceof Date 
          ? metricsData.lastEventDate 
          : new Date(metricsData.lastEventDate);
      }
      if ('engagementStreak' in metricsData && typeof metricsData.engagementStreak === 'number') {
        newMetrics.engagementStreak = metricsData.engagementStreak;
      }
      if ('lastEngagementDate' in metricsData && metricsData.lastEngagementDate) {
        newMetrics.lastEngagementDate = metricsData.lastEngagementDate instanceof Date 
          ? metricsData.lastEngagementDate 
          : new Date(metricsData.lastEngagementDate);
      }
      if ('roomPreference' in metricsData && metricsData.roomPreference) {
        newMetrics.roomPreference = String(metricsData.roomPreference);
      }
      if ('activityPreference' in metricsData && metricsData.activityPreference) {
        newMetrics.activityPreference = String(metricsData.activityPreference);
      }
      this.userEngagementMetrics.set(id, newMetrics);
      return newMetrics;
    }
  }

  // User event registrations operations
  async getUserEventRegistrations(userId: number): Promise<UserEventRegistration[]> {
    return Array.from(this.userEventRegistrations.values())
      .filter(registration => registration.userId === userId);
  }

  async createUserEventRegistration(registration: InsertUserEventRegistration): Promise<UserEventRegistration> {
    const newRegistration: UserEventRegistration = {
      ...registration,
      status: registration.status || "registered",
      attended: registration.attended || false,
      feedback: registration.feedback || null,
      rating: registration.rating || null,
      registeredAt: new Date(),
    };
    const key = `${registration.userId}-${registration.eventId}`;
    this.userEventRegistrations.set(key, newRegistration);
    return newRegistration;
  }

  async updateUserEventRegistration(userId: number, eventId: number, data: Partial<UserEventRegistration>): Promise<UserEventRegistration | undefined> {
    const key = `${userId}-${eventId}`;
    const registration = this.userEventRegistrations.get(key);
    if (!registration) return undefined;

    const updatedRegistration: UserEventRegistration = {
      ...registration,
      ...data,
    };
    this.userEventRegistrations.set(key, updatedRegistration);
    return updatedRegistration;
  }

  // User volunteer hours operations
  async getUserVolunteerHours(userId: number): Promise<UserVolunteerHours[]> {
    return Array.from(this.userVolunteerHours.values())
      .filter(hours => hours.userId === userId);
  }

  async createUserVolunteerHours(volunteerHours: InsertUserVolunteerHours): Promise<UserVolunteerHours> {
    const id = this.userVolunteerHoursId++;
    const newVolunteerHours: UserVolunteerHours = {
      ...volunteerHours,
      id,
      eventId: volunteerHours.eventId || null,
      verifiedBy: volunteerHours.verifiedBy || null,
      createdAt: new Date(),
    };
    this.userVolunteerHours.set(id, newVolunteerHours);
    return newVolunteerHours;
  }

  // User preferences operations
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(userId);
  }

  async updateUserPreferences(userId: number, preferenceData: Partial<UserPreferences>): Promise<UserPreferences | undefined> {
    const existingPreferences = this.userPreferences.get(userId);
    
    if (existingPreferences) {
      // Update existing preferences
      const updatedPreferences: UserPreferences = {
        ...existingPreferences,
        ...preferenceData,
        updatedAt: new Date(),
      };
      this.userPreferences.set(userId, updatedPreferences);
      return updatedPreferences;
    } else if ('preferences' in preferenceData) {
      // Create new preferences
      const newPreferences: UserPreferences = {
        userId,
        preferences: preferenceData.preferences as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.userPreferences.set(userId, newPreferences);
      return newPreferences;
    }
    
    return undefined;
  }
  
  // Site images operations
  async getSiteImages(): Promise<SiteImage[]> {
    return Array.from(this.siteImages.values());
  }

  async getSiteImageById(id: number): Promise<SiteImage | undefined> {
    return this.siteImages.get(id);
  }

  async getSiteImagesByCategory(category: string): Promise<SiteImage[]> {
    return Array.from(this.siteImages.values()).filter(
      image => image.category === category
    );
  }

  async createSiteImage(siteImage: InsertSiteImage): Promise<SiteImage> {
    const id = this.siteImageId++;
    const newSiteImage: SiteImage = {
      ...siteImage,
      id,
      description: siteImage.description || null,
      createdAt: new Date(),
    };
    this.siteImages.set(id, newSiteImage);
    return newSiteImage;
  }

  async updateSiteImage(id: number, siteImageData: Partial<SiteImage>): Promise<SiteImage | undefined> {
    const existingImage = await this.getSiteImageById(id);
    if (!existingImage) {
      return undefined;
    }

    const updatedImage: SiteImage = {
      ...existingImage,
      ...siteImageData,
    };
    this.siteImages.set(id, updatedImage);
    return updatedImage;
  }

  async deleteSiteImage(id: number): Promise<boolean> {
    const exists = this.siteImages.has(id);
    if (!exists) {
      return false;
    }
    this.siteImages.delete(id);
    return true;
  }
}

export const storage = new MemStorage();
