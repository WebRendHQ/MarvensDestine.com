import { google } from 'googleapis';

// Google Calendar service setup
const calendar = google.calendar('v3');

// Service account authentication
const auth = new google.auth.GoogleAuth({
  // You'll need to add your service account key file path or credentials
  // keyFile: './path/to/your/service-account-key.json',
  // OR use environment variables for the credentials
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

export interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{ email: string }>;
}

export async function createCalendarEvent(eventDetails: CalendarEvent) {
  try {
    const authClient = await auth.getClient();
    
    // Create event in founder@blenderbin.com's calendar
    const event = await calendar.events.insert({
      auth: authClient,
      calendarId: 'founder@blenderbin.com',
      requestBody: {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: eventDetails.start,
        end: eventDetails.end,
        attendees: eventDetails.attendees,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 },     // 30 minutes before
          ],
        },
        // Automatically send invitations
        sendUpdates: 'all' as const,
        // Create Google Meet link
        conferenceData: {
          createRequest: {
            requestId: `discovery-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        }
      },
      // Required to create Google Meet links
      conferenceDataVersion: 1,
    });

    return {
      success: true,
      eventId: event.data.id,
      meetLink: event.data.conferenceData?.entryPoints?.[0]?.uri,
      event: event.data
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateCalendarEvent(eventId: string, eventDetails: CalendarEvent) {
  try {
    const authClient = await auth.getClient();
    
    const event = await calendar.events.update({
      auth: authClient,
      calendarId: 'founder@blenderbin.com',
      eventId: eventId,
      requestBody: {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: eventDetails.start,
        end: eventDetails.end,
        attendees: eventDetails.attendees,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
        sendUpdates: 'all' as const,
      },
    });

    return {
      success: true,
      event: event.data
    };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Check if Google Calendar is properly configured
export function isCalendarConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && 
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  );
} 