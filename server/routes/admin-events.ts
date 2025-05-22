import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { fromZodError } from 'zod-validation-error';
import { insertEventSchema } from '@shared/schema';

const router = Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all events (admin view)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const events = await storage.getEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Create a new event
router.post('/', async (req: Request, res: Response) => {
  try {
    const validationResult = insertEventSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errorMessage = fromZodError(validationResult.error).message;
      return res.status(400).json({ message: errorMessage });
    }
    
    const eventData = validationResult.data;
    const event = await storage.createEvent(eventData);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Get a single event by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await storage.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Update an event
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const existingEvent = await storage.getEventById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const validationResult = insertEventSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = fromZodError(validationResult.error).message;
      return res.status(400).json({ message: errorMessage });
    }

    const eventData = validationResult.data;
    // Implement updateEvent in storage.ts
    const updatedEvent = await storage.updateEvent(eventId, eventData);
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Delete an event
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const existingEvent = await storage.getEventById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Implement deleteEvent in storage.ts
    await storage.deleteEvent(eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

export default router;