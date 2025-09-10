import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { google } from 'googleapis';

interface FreeBusyRequestBody {
  startHour?: number; // local hours
  endHour?: number;   // local hours (exclusive end)
  slotMinutes?: number; // meeting slot length in minutes
  daysAhead?: number; // how many days ahead to search
  timeZone?: string;  // IANA TZ
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function POST(request: NextRequest) {
  try {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    if (!clientEmail || !privateKeyRaw) {
      const missing = [
        !clientEmail ? 'GOOGLE_SERVICE_ACCOUNT_EMAIL' : null,
        !privateKeyRaw ? 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY' : null,
      ].filter(Boolean);
      return NextResponse.json(
        { success: false, error: `Missing required env var(s): ${missing.join(', ')}` },
        { status: 500 }
      );
    }
    const body = (await request.json()) as FreeBusyRequestBody | undefined;
    const startHour = body?.startHour ?? 9;
    const endHour = body?.endHour ?? 18;
    const slotMinutes = body?.slotMinutes ?? 60;
    const daysAhead = body?.daysAhead ?? 14;
    const timeZone = body?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKeyRaw.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    const calendar = google.calendar({ version: 'v3', auth });

    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = addDays(now, daysAhead).toISOString();

    // Query busy periods
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'founder@blenderbin.com';
    const freebusy = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone,
        items: [{ id: calendarId }],
      },
    });

    const busy = freebusy.data.calendars?.[calendarId]?.busy ?? [];

    // Helper to check overlap
    const overlapsBusy = (start: Date, end: Date): boolean => {
      for (const b of busy) {
        if (!b.start || !b.end) continue;
        const bs = new Date(b.start);
        const be = new Date(b.end);
        if (start < be && end > bs) return true;
      }
      return false;
    };

    // Search earliest available slot within business hours across days
    let earliest: { start: string; end: string } | null = null;
    for (let d = 0; d <= daysAhead; d++) {
      const day = addDays(now, d);
      // Skip past dates
      const dayStart = new Date(day);
      dayStart.setHours(startHour, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(endHour, 0, 0, 0);

      for (let t = new Date(dayStart); t < dayEnd; t = new Date(t.getTime() + slotMinutes * 60000)) {
        const slotStart = new Date(t);
        const slotEnd = new Date(t.getTime() + slotMinutes * 60000);

        // Ensure slot is in the future by at least 1 hour
        if (slotStart < new Date(now.getTime() + 60 * 60000)) continue;
        // Overlap check
        if (!overlapsBusy(slotStart, slotEnd)) {
          earliest = { start: slotStart.toISOString(), end: slotEnd.toISOString() };
          break;
        }
      }
      if (earliest) break;
    }

    return NextResponse.json({ success: true, earliest, busy });
  } catch (error) {
    console.error('FreeBusy API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to read calendar availability';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


