import { NextRequest, NextResponse } from 'next/server';
import { createCalendarEvent, isCalendarConfigured, CalendarEvent } from '@/lib/googleCalendar';

export async function POST(request: NextRequest) {
  try {
    // Check if Google Calendar is configured
    if (!isCalendarConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Google Calendar is not configured. Please set up service account credentials.' 
        },
        { status: 500 }
      );
    }

    // Parse the request body
    const eventDetails: CalendarEvent = await request.json();

    // Validate required fields
    if (!eventDetails.summary || !eventDetails.start || !eventDetails.end || !eventDetails.attendees) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: summary, start, end, or attendees' 
        },
        { status: 400 }
      );
    }

    // Create the calendar event
    const result = await createCalendarEvent(eventDetails);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Calendar event created successfully',
        eventId: result.eventId,
        meetLink: result.meetLink,
        event: result.event
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error creating calendar event:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 