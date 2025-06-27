import { NextRequest, NextResponse } from 'next/server';
import { updateCalendarEvent, isCalendarConfigured, CalendarEvent } from '@/lib/googleCalendar';

export async function PUT(request: NextRequest) {
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
    const body = await request.json();
    const { eventId, ...eventDetails }: { eventId: string } & CalendarEvent = body;

    // Validate required fields
    if (!eventId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required field: eventId' 
        },
        { status: 400 }
      );
    }

    if (!eventDetails.summary || !eventDetails.start || !eventDetails.end || !eventDetails.attendees) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: summary, start, end, or attendees' 
        },
        { status: 400 }
      );
    }

    // Update the calendar event
    const result = await updateCalendarEvent(eventId, eventDetails);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Calendar event updated successfully',
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
    console.error('API Error updating calendar event:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 