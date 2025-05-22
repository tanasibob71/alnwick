import { pgTable, text, serial, integer, boolean, timestamp, date, primaryKey, json, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Room schema
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  capacity: integer("capacity").notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  halfDayRate: integer("half_day_rate").notNull(),
  fullDayRate: integer("full_day_rate").notNull(),
  features: text("features").array().notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
});

// Booking schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  organization: text("organization"),
  roomId: integer("room_id").notNull(),
  date: date("date").notNull(),
  timeSlot: text("time_slot"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  eventType: text("event_type").notNull(),
  attendees: integer("attendees").notNull(),
  description: text("description"),
  eventImage: text("event_image"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Event schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: date("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  roomId: integer("room_id").notNull(),
  category: text("category").notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

// Donation schema
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  amount: integer("amount").notNull(),
  isRecurring: boolean("is_recurring").notNull().default(false),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  message: text("message"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

// Contact message schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  attachments: text("attachments").array(),
  subscribeToNewsletter: boolean("subscribe_to_newsletter").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

// Newsletter subscribers schema
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  profilePictureUrl: text("profile_picture_url"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
});

// User engagement metrics
export const userEngagementMetrics = pgTable("user_engagement_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  bookingsCount: integer("bookings_count").notNull().default(0),
  eventsAttended: integer("events_attended").notNull().default(0),
  donationsCount: integer("donations_count").notNull().default(0),
  totalDonationAmount: integer("total_donation_amount").notNull().default(0),
  volunteerHours: integer("volunteer_hours").notNull().default(0),
  // New engagement metrics
  communityPoints: integer("community_points").notNull().default(0),
  eventFeedbackCount: integer("event_feedback_count").notNull().default(0),
  avgEventRating: decimal("avg_event_rating", { precision: 3, scale: 2 }).default('0'),
  lastEventDate: timestamp("last_event_date"),
  engagementStreak: integer("engagement_streak").notNull().default(0),
  lastEngagementDate: timestamp("last_engagement_date"),
  roomPreference: text("room_preference"),
  activityPreference: text("activity_preference"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertUserEngagementMetricsSchema = createInsertSchema(userEngagementMetrics).omit({
  id: true,
  lastUpdated: true,
});

// User events
export const userEventRegistrations = pgTable("user_event_registrations", {
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventId: integer("event_id").notNull().references(() => events.id, { onDelete: 'cascade' }),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  status: text("status").notNull().default("registered"),
  attended: boolean("attended").notNull().default(false),
  feedback: text("feedback"),
  rating: integer("rating"),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.eventId] }),
  };
});

export const insertUserEventRegistrationSchema = createInsertSchema(userEventRegistrations).omit({
  registeredAt: true,
});

// User volunteer hours
export const userVolunteerHours = pgTable("user_volunteer_hours", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventId: integer("event_id").references(() => events.id, { onDelete: 'set null' }),
  hoursLogged: integer("hours_logged").notNull(),
  activityDescription: text("activity_description").notNull(),
  date: date("date").notNull(),
  verifiedBy: integer("verified_by").references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserVolunteerHoursSchema = createInsertSchema(userVolunteerHours).omit({
  id: true,
  createdAt: true,
});

// User saved preferences
export const userPreferences = pgTable("user_preferences", {
  userId: integer("user_id").primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  preferences: json("preferences").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  createdAt: true,
  updatedAt: true,
});

// Type exports for user-related tables
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserEngagementMetrics = typeof userEngagementMetrics.$inferSelect;
export type InsertUserEngagementMetrics = z.infer<typeof insertUserEngagementMetricsSchema>;

export type UserEventRegistration = typeof userEventRegistrations.$inferSelect;
export type InsertUserEventRegistration = z.infer<typeof insertUserEventRegistrationSchema>;

export type UserVolunteerHours = typeof userVolunteerHours.$inferSelect;
export type InsertUserVolunteerHours = z.infer<typeof insertUserVolunteerHoursSchema>;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

// Site images schema
export const siteImages = pgTable("site_images", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSiteImageSchema = createInsertSchema(siteImages).omit({
  id: true,
  createdAt: true,
});

export type SiteImage = typeof siteImages.$inferSelect;
export type InsertSiteImage = z.infer<typeof insertSiteImageSchema>;
