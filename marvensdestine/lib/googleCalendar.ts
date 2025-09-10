import { google } from 'googleapis';

function buildAuth() {
  // Prefer full JSON to avoid newline escaping issues
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (json) {
    try {
      const parsed = JSON.parse(json);
      return new google.auth.GoogleAuth({
        credentials: parsed,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });
    } catch {
      throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY_JSON');
    }
  }
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!clientEmail || !privateKey) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY');
  }
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
}

// Google Calendar service setup with auth (lazy to surface clear errors early)
const auth = buildAuth();
const calendar = google.calendar({ version: 'v3', auth });

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
    // Auth is attached to the calendar client during initialization
    // Create event in founder@blenderbin.com's calendar
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'founder@blenderbin.com';
    const event = await calendar.events.insert({
      calendarId,
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
      // Automatically send invitations
      sendUpdates: 'all',
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
    // Auth is attached to the calendar client during initialization
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'founder@blenderbin.com';
    const event = await calendar.events.update({
      calendarId,
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
      },
      sendUpdates: 'all',
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