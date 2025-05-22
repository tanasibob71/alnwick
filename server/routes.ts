import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactMessageSchema, insertDonationSchema, insertNewsletterSubscriberSchema, insertSiteImageSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { sendEmailNotification, createHtmlEmailBody, sendNewsletter } from "./email-service";
import { upload, getPublicFileUrl } from "./upload-service";
import { adminMiddleware, authMiddleware } from "./middleware/auth";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import adminEventsRoutes from "./routes/admin-events";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register auth and dashboard routes
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/admin/events', adminEventsRoutes);
  
  // File upload endpoint
  app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Return the file information
      const fileUrl = getPublicFileUrl(req.file.filename);
      return res.status(200).json({
        success: true,
        file: {
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('File upload error:', error);
      return res.status(500).json({ 
        error: 'File upload failed',
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Multi-file upload endpoint
  app.post('/api/upload/multiple', upload.array('images', 10), (req: Request, res: Response) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      // Return information for all uploaded files
      const files = Array.isArray(req.files) ? req.files.map(file => ({
        url: getPublicFileUrl(file.filename),
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      })) : [];
      
      return res.status(200).json({
        success: true,
        count: files.length,
        files
      });
    } catch (error) {
      console.error('Multi-file upload error:', error);
      return res.status(500).json({ 
        error: 'File upload failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Basic auth routes
  app.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try {
      // Add debugging
      console.log(`Attempting login with email: ${email}`);
      
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        console.log(`No user found with email: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      console.log(`User found, comparing passwords`);
      
      // In a real app, we would compare hashed passwords here
      if (user.password !== password) {
        console.log(`Password mismatch for user: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Set user ID in session
      req.session.userId = user.id;
      
      // Return user data without the password
      const { password: _, ...userWithoutPassword } = user;
      console.log(`Login successful for: ${email}`);
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const { email, password, name, role = 'user' } = req.body;
      
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required' });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Create new user
      const newUser = await storage.createUser({
        email,
        password, // Should be hashed in a real app
        name,
        role,
      });
      
      // Set user ID in session
      req.session.userId = newUser.id;
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/logout', (req: Request, res: Response) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
  
  // Current user endpoint for React Authentication
  app.get('/api/user', authMiddleware, async (req: Request, res: Response) => {
    try {
      // We know the user exists because authMiddleware has already checked
      // Return user data without the password for security
      const { password: _, ...userWithoutPassword } = req.user;
      console.log(`Successfully retrieved user: ${req.user.email}, role: ${req.user.role}`);
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Admin API routes for form submissions and user management
  
  // Admin routes for viewing form submissions
  app.get('/api/admin/contact-messages', adminMiddleware, async (_req: Request, res: Response) => {
    try {
      // For now, we don't have a direct method to get all contact messages, so we'll create one
      const messages = await storage.getContactMessages();
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Admin route for viewing newsletter subscribers
  app.get('/api/admin/newsletter-subscribers', adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      return res.status(200).json(subscribers);
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Admin route for deleting a newsletter subscriber
  app.delete('/api/admin/newsletter-subscribers/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid subscriber ID' });
      }
      
      // Implement a method to delete a newsletter subscriber in storage.ts
      await storage.deleteNewsletterSubscriber(id);
      
      return res.status(200).json({ message: 'Subscriber deleted successfully' });
    } catch (error) {
      console.error('Error deleting newsletter subscriber:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Admin route for sending a newsletter
  app.post('/api/admin/send-newsletter', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { subject, content, testMode, testEmail } = req.body;
      
      // Validate required fields
      if (!subject || !content) {
        return res.status(400).json({ message: 'Subject and content are required' });
      }
      
      // For test mode, validate test email
      if (testMode && !testEmail) {
        return res.status(400).json({ message: 'Test email is required when in test mode' });
      }
      
      // If in test mode, just send to the test email
      if (testMode) {
        const success = await sendNewsletter(
          { subject, content, testMode, testEmail },
          [testEmail]
        );
        
        if (!success) {
          return res.status(500).json({ message: 'Failed to send test newsletter' });
        }
        
        return res.status(200).json({ 
          success: true,
          message: 'Test newsletter sent successfully',
          testMode: true
        });
      }
      
      // Not in test mode, send to all subscribers
      const subscribers = await storage.getNewsletterSubscribers();
      
      if (subscribers.length === 0) {
        return res.status(400).json({ message: 'No subscribers to send newsletter to' });
      }
      
      // Extract just the email addresses
      const subscriberEmails = subscribers.map(sub => sub.email);
      
      const success = await sendNewsletter(
        { subject, content, testMode: false },
        subscriberEmails
      );
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to send newsletter' });
      }
      
      return res.status(200).json({ 
        success: true,
        message: `Newsletter sent to ${subscribers.length} subscribers`,
        subscriberCount: subscribers.length
      });
      
    } catch (error) {
      console.error('Error sending newsletter:', error);
      res.status(500).json({ 
        message: 'Failed to send newsletter',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get('/api/admin/bookings', adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const bookings = await storage.getBookings();
      return res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/admin/donations', adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const donations = await storage.getDonations();
      return res.status(200).json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  // User management routes for admins
  app.get('/api/admin/users', adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const users = await storage.getUsers();
      // Return all users without their passwords
      const safeUsers = users.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      return res.status(200).json(safeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/admin/users', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const { name, email, password, role = 'user' } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      const newUser = await storage.createUser({ name, email, password, role });
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put('/api/admin/users/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { name, email, password, role } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      // Check if user exists
      const existingUser = await storage.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update the user
      const updatedUser = await storage.updateUser(userId, { 
        name: name || existingUser.name,
        email: email || existingUser.email,
        password: password || existingUser.password,
        role: role || existingUser.role
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found after update' });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.delete('/api/admin/users/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      // Prevent deleting yourself
      if (userId === req.session?.userId) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }
      
      // Check if user exists
      const existingUser = await storage.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Delete the user
      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to delete user' });
      }
      
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Route for a user to update their own profile
  app.put('/api/user/profile', async (req: Request, res: Response) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      const userId = req.session.userId;
      const { name, email, currentPassword, newPassword } = req.body;
      
      // Get current user
      const currentUser = await storage.getUserById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // If changing password, verify current password
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required to set a new password' });
        }
        
        if (currentUser.password !== currentPassword) {
          return res.status(401).json({ message: 'Current password is incorrect' });
        }
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, {
        name: name || currentUser.name,
        email: email || currentUser.email,
        password: newPassword || currentUser.password
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found after update' });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  // Room routes
  app.get("/api/rooms", async (_req: Request, res: Response) => {
    try {
      const rooms = await storage.getRooms();
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  app.get("/api/rooms/:id", async (req: Request, res: Response) => {
    try {
      const roomId = parseInt(req.params.id);
      if (isNaN(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }

      const room = await storage.getRoomById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      res.json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ message: "Failed to fetch room" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const validationResult = insertBookingSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const bookingData = validationResult.data;
      const booking = await storage.createBooking(bookingData);
      
      // Get room details for the email
      const room = await storage.getRoomById(bookingData.roomId);
      const roomName = room ? room.name : `Room ID: ${bookingData.roomId}`;
      
      // Send email notification
      await sendEmailNotification({
        subject: `New Room Booking: ${roomName}`,
        text: `New room booking from ${bookingData.name} (${bookingData.email}) for ${roomName} on ${bookingData.date}.`,
        html: createHtmlEmailBody({
          "Form Type": "Room Booking Request",
          "Name": bookingData.name,
          "Email": bookingData.email,
          "Phone": bookingData.phone,
          "Room": roomName,
          "Date": bookingData.date,
          "Time": bookingData.startTime && bookingData.endTime 
            ? `${bookingData.startTime} - ${bookingData.endTime}` 
            : (bookingData.timeSlot || "Not specified"),
          "Event Type": bookingData.eventType,
          "Expected Attendees": bookingData.attendees,
          "Organization": bookingData.organization || "N/A",
          "Description": bookingData.description || "N/A",
          "Status": "Pending",
          "Submitted At": new Date().toLocaleString()
        })
      });
      
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/availability", async (req: Request, res: Response) => {
    try {
      const { date, roomId } = req.query;
      
      if (!date || typeof date !== 'string') {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const bookings = await storage.getBookingsByDate(date);
      
      // Filter by room if roomId is provided
      const filteredBookings = roomId 
        ? bookings.filter(booking => booking.roomId === parseInt(roomId as string))
        : bookings;
      
      res.json(filteredBookings);
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // Event routes
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const { year, month } = req.query;
      
      // If year and month are provided, filter events by month
      if (year && month && !isNaN(Number(year)) && !isNaN(Number(month))) {
        const events = await storage.getEventsByMonth(
          parseInt(year as string),
          parseInt(month as string)
        );
        return res.json(events);
      }
      
      // Otherwise return all events
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const event = await storage.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Donation routes
  app.post("/api/donations", async (req: Request, res: Response) => {
    try {
      const validationResult = insertDonationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const donationData = validationResult.data;
      const donation = await storage.createDonation(donationData);
      
      // Format amount as currency
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(donationData.amount);
      
      // Create donation display name
      const donorName = donationData.isAnonymous ? "Anonymous Donor" : donationData.name;
      
      // Send email notification
      await sendEmailNotification({
        subject: `New Donation: ${formattedAmount}`,
        text: `New donation of ${formattedAmount} from ${donorName} (${donationData.email}).`,
        html: createHtmlEmailBody({
          "Form Type": "Donation",
          "Donor": donorName,
          "Email": donationData.email,
          "Amount": formattedAmount,
          "Recurring Donation": donationData.isRecurring ? "Yes" : "No",
          "Anonymous": donationData.isAnonymous ? "Yes" : "No",
          "Message": donationData.message || "N/A",
          "Submitted At": new Date().toLocaleString()
        })
      });
      
      res.status(201).json(donation);
    } catch (error) {
      console.error("Error creating donation:", error);
      res.status(500).json({ message: "Failed to process donation" });
    }
  });

  app.get("/api/donations/total", async (_req: Request, res: Response) => {
    try {
      const total = await storage.getTotalDonationAmount();
      // For demo purposes, we'll add a base amount to show progress
      const baseAmount = 50000; 
      res.json({ total: total + baseAmount, goal: 250000 });
    } catch (error) {
      console.error("Error fetching donation total:", error);
      res.status(500).json({ message: "Failed to fetch donation total" });
    }
  });

  // Contact message routes
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validationResult = insertContactMessageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const contactData = validationResult.data;
      const message = await storage.createContactMessage(contactData);
      
      // Send email notification
      await sendEmailNotification({
        subject: `Contact Form: ${contactData.subject}`,
        text: `New contact message from ${contactData.name} (${contactData.email}): ${contactData.message}`,
        html: createHtmlEmailBody({
          "Form Type": "Contact Form",
          "Name": contactData.name,
          "Email": contactData.email,
          "Subject": contactData.subject,
          "Message": contactData.message,
          "Newsletter Signup": contactData.subscribeToNewsletter || false,
          "Submitted At": new Date().toLocaleString()
        })
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Newsletter subscription routes
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      const validationResult = insertNewsletterSubscriberSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Check if email is already subscribed
      const isSubscribed = await storage.isEmailSubscribed(req.body.email);
      if (isSubscribed) {
        return res.json({ message: "Email is already subscribed" });
      }
      
      const subscriberData = validationResult.data;
      const subscriber = await storage.createNewsletterSubscriber(subscriberData);
      
      // Send email notification
      await sendEmailNotification({
        subject: "New Newsletter Subscription",
        text: `New newsletter subscription: ${subscriberData.email}`,
        html: createHtmlEmailBody({
          "Form Type": "Newsletter Subscription",
          "Email": subscriberData.email,
          "Subscribed At": new Date().toLocaleString()
        })
      });
      
      res.status(201).json(subscriber);
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Site Images API Routes
  app.get("/api/site-images", async (_req: Request, res: Response) => {
    try {
      const images = await storage.getSiteImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching site images:", error);
      res.status(500).json({ message: "Failed to fetch site images" });
    }
  });
  
  app.get("/api/site-images/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const images = await storage.getSiteImagesByCategory(category);
      res.json(images);
    } catch (error) {
      console.error("Error fetching site images by category:", error);
      res.status(500).json({ message: "Failed to fetch site images" });
    }
  });
  
  app.get("/api/site-images/:id", async (req: Request, res: Response) => {
    try {
      const imageId = parseInt(req.params.id);
      if (isNaN(imageId)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }
      
      const image = await storage.getSiteImageById(imageId);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.json(image);
    } catch (error) {
      console.error("Error fetching site image:", error);
      res.status(500).json({ message: "Failed to fetch site image" });
    }
  });
  
  app.post("/api/site-images", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const validationResult = insertSiteImageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const siteImageData = validationResult.data;
      const newImage = await storage.createSiteImage(siteImageData);
      
      res.status(201).json(newImage);
    } catch (error) {
      console.error("Error creating site image:", error);
      res.status(500).json({ message: "Failed to create site image" });
    }
  });
  
  app.put("/api/site-images/:id", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const imageId = parseInt(req.params.id);
      if (isNaN(imageId)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }
      
      const image = await storage.getSiteImageById(imageId);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      const updatedImage = await storage.updateSiteImage(imageId, req.body);
      res.json(updatedImage);
    } catch (error) {
      console.error("Error updating site image:", error);
      res.status(500).json({ message: "Failed to update site image" });
    }
  });
  
  app.delete("/api/site-images/:id", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const imageId = parseInt(req.params.id);
      if (isNaN(imageId)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }
      
      const deleted = await storage.deleteSiteImage(imageId);
      if (!deleted) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting site image:", error);
      res.status(500).json({ message: "Failed to delete site image" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
