"use client";

import { useState, useEffect } from 'react';
import { format, addHours, isAfter, isSameDay, startOfDay, addDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import styles from './discovery.module.css';

interface TimeSlot {
  time: string;
  available: boolean;
  date: Date;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
}

export default function DiscoveryPage() {
  const router = useRouter();
  const [step, setStep] = useState<'calendar' | 'questions' | 'confirmed'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [eventId, setEventId] = useState<string>('');
  const [meetLink, setMeetLink] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Generate time slots for the current day
  const generateTimeSlots = () => {
    const now = new Date();
    const slots: TimeSlot[] = [];
    
    // Business hours: 9 AM to 6 PM
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = new Date();
      slotTime.setHours(hour, 0, 0, 0);
      
      // Check if slot is in the future (at least 1 hour from now)
      const isAvailable = isAfter(slotTime, addHours(now, 1)) && isSameDay(slotTime, now);
      
      slots.push({
        time: format(slotTime, 'h:mm a'),
        available: isAvailable,
        date: slotTime
      });
    }
    
    // If no slots available today, generate for next business day
    if (!slots.some(slot => slot.available)) {
      const nextDay = addDays(startOfDay(now), 1);
      for (let hour = startHour; hour < endHour; hour++) {
        const slotTime = new Date(nextDay);
        slotTime.setHours(hour, 0, 0, 0);
        
        slots.push({
          time: format(slotTime, 'h:mm a'),
          available: true,
          date: slotTime
        });
      }
      setSelectedDate(nextDay);
    }
    
    return slots;
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Ask server for earliest available free/busy slot
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const resp = await fetch('/api/calendar/freebusy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeZone: tz, startHour: 9, endHour: 18, slotMinutes: 60, daysAhead: 14 })
        });
        if (!resp.ok) {
          const errText = await resp.text();
          // Surface server error details in dev console for debugging
          // (Endpoint does not expose secrets; it returns only messages)
          console.error('freebusy failed', resp.status, errText);
          throw new Error(`freebusy ${resp.status}`);
        }
        const data = await resp.json();

        if (data?.earliest?.start && data?.earliest?.end) {
          const start = new Date(data.earliest.start);
          const newDate = startOfDay(start);
          setSelectedDate(newDate);

          // Build slots for that date only, marking selected
          const startHour = 9;
          const endHour = 18;
          const slots: TimeSlot[] = [];
          for (let hour = startHour; hour < endHour; hour++) {
            const slotTime = new Date(newDate);
            slotTime.setHours(hour, 0, 0, 0);
            const available = slotTime.getTime() === start.getTime();
            slots.push({ time: format(slotTime, 'h:mm a'), available: available || slotTime > new Date(), date: slotTime });
          }
          setTimeSlots(slots);
          setSelectedTime(format(start, 'h:mm a'));
          return;
        }

        // Fallback to local generation if API unavailable/no availability
        const localSlots = generateTimeSlots();
        setTimeSlots(localSlots);
        const firstAvailable = localSlots.find(slot => slot.available);
        if (firstAvailable) setSelectedTime(firstAvailable.time);
      } catch {
        const localSlots = generateTimeSlots();
        setTimeSlots(localSlots);
        const firstAvailable = localSlots.find(slot => slot.available);
        if (firstAvailable) setSelectedTime(firstAvailable.time);
      }
    };
    void init();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Create Google Calendar event automatically
  const createCalendarEvent = async () => {
    const selectedSlot = timeSlots.find(slot => slot.time === selectedTime);
    if (!selectedSlot) return;

    const startTime = selectedSlot.date;
    const endTime = addHours(startTime, 1); // 1 hour meeting
    
    const eventDetails = {
      summary: `Discovery Call - ${formData.firstName} ${formData.lastName}`,
      description: `Discovery call with ${formData.firstName} ${formData.lastName}.\n\nClient Email: ${formData.email}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: [
        { email: 'founder@blenderbin.com' },
        { email: formData.email }
      ]
    };

    // Create calendar event via API
    try {
      const response = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEventId(result.eventId);
        setMeetLink(result.meetLink || '');
        console.log('✅ Calendar event created successfully:', result);
        return result;
      } else {
        console.log('⚠️ Calendar API error:', result.error);
        // Still continue with the booking flow
        return eventDetails;
      }
    } catch (error) {
      console.log('⚠️ Calendar API not available:', error);
      // Still continue with the booking flow
      return eventDetails;
    }
  };

  // Handle calendar booking
  const handleBookCall = async () => {
    if (!selectedTime || !formData.email) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create calendar event
      await createCalendarEvent();
      
      setStep('questions');
    } catch (error) {
      console.error('Error booking call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle project questions submission
  const handleSubmitQuestions = async () => {
    setIsLoading(true);
    
    try {
      // Update calendar event with project details if we have an eventId
      if (eventId) {
        const selectedSlot = timeSlots.find(slot => slot.time === selectedTime);
        if (selectedSlot) {
          const startTime = selectedSlot.date;
          const endTime = addHours(startTime, 1);
          
          const updatedEventDetails = {
            eventId: eventId,
            summary: `Discovery Call - ${formData.firstName} ${formData.lastName}`,
            description: `Discovery call with ${formData.firstName} ${formData.lastName}.\n\nProject Type: ${formData.projectType}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\n\nProject Description:\n${formData.description}\n\nClient Email: ${formData.email}`,
            start: {
              dateTime: startTime.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            attendees: [
              { email: 'founder@blenderbin.com' },
              { email: formData.email }
            ]
          };

          try {
            const response = await fetch('/api/calendar/update', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedEventDetails)
            });
            
            const result = await response.json();
            
            if (result.success) {
              console.log('✅ Calendar event updated with project details:', result);
            } else {
              console.log('⚠️ Calendar update error:', result.error);
            }
          } catch (error) {
            console.log('⚠️ Calendar update failed:', error);
          }
        }
      }
      
      // Simulate API submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep('confirmed');
    } catch (error) {
      console.error('Error submitting questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => router.push('/')}
          aria-label="Back to home"
        >
          ← Back
        </button>
        <h1 className={styles.title}>Schedule Discovery Call</h1>
      </div>

      {step === 'calendar' && (
        <div className={styles.calendarContainer}>
          <div className={styles.calendarSection}>
            <h2>Select Your Time</h2>
            <p className={styles.subtitle}>
              Next available: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
            
            <div className={styles.timeSlots}>
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  className={`${styles.timeSlot} ${
                    slot.time === selectedTime ? styles.selected : ''
                  } ${!slot.available ? styles.unavailable : ''}`}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Your Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button
              className={styles.bookButton}
              onClick={handleBookCall}
              disabled={!selectedTime || !formData.email || !formData.firstName || !formData.lastName || isLoading}
            >
              {isLoading ? 'Booking...' : 'Book Discovery Call'}
            </button>
          </div>
        </div>
      )}

      {step === 'questions' && (
        <div className={styles.questionsContainer}>
          <div className={styles.successMessage}>
            <div className={styles.checkmark}>✓</div>
            <h2>Call Scheduled!</h2>
            <p>Your discovery call is scheduled for {selectedTime} on {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
          </div>

          <div className={styles.questionsForm}>
            <h3>Tell us about your project</h3>
            <p className={styles.subtitle}>Help us prepare for our conversation</p>

            <div className={styles.inputGroup}>
              <label htmlFor="projectType">Project Type</label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={(e) => handleInputChange('projectType', e.target.value)}
                required
              >
                <option value="">Select project type</option>
                <option value="3d-visualization">3D Visualization & Animation</option>
                <option value="product-design">Product Design & Prototyping</option>
                <option value="animation">Motion Graphics & Animation</option>
                <option value="web-experience">Interactive Web Experience</option>
                <option value="nft-collection">NFT Collection Development</option>
                <option value="branding">Branding & Visual Identity</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="budget">Budget Range</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                required
              >
                <option value="">Select budget range</option>
                <option value="5k-15k">$5K - $15K</option>
                <option value="15k-35k">$15K - $35K</option>
                <option value="35k-75k">$35K - $75K</option>
                <option value="75k-150k">$75K - $150K</option>
                <option value="150k+">$150K+</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="timeline">Project Timeline</label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                required
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP (Rush project)</option>
                <option value="1-2-months">1-2 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-12-months">6-12 months</option>
                <option value="flexible">Flexible timeline</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="description">Project Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us about your project vision, goals, target audience, and any specific requirements or features you have in mind..."
                rows={5}
                required
              />
            </div>

            <button
              className={styles.submitButton}
              onClick={handleSubmitQuestions}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Project Details'}
            </button>
          </div>
        </div>
      )}

      {step === 'confirmed' && (
        <div className={styles.confirmationContainer}>
          <div className={styles.confirmationContent}>
            <div className={styles.largeCheckmark}>✓</div>
            <h2>All Set!</h2>
            <p>
              Thanks for scheduling your discovery call. We&apos;ll be in touch via email with additional details and a calendar invite.
            </p>
            <div className={styles.meetingDetails}>
              <h4>Meeting Details:</h4>
              <p><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Duration:</strong> 60 minutes</p>
              <p><strong>Location:</strong> {meetLink ? (
                <a href={meetLink} target="_blank" rel="noopener noreferrer" className={styles.meetLink}>
                  Google Meet (Join Link)
                </a>
              ) : (
                'Google Meet (link will be provided via email)'
              )}</p>
              {meetLink && (
                <p><strong>Meet Link:</strong> <a href={meetLink} target="_blank" rel="noopener noreferrer" className={styles.meetLink}>{meetLink}</a></p>
              )}
            </div>
            <button
              className={styles.homeButton}
              onClick={() => router.push('/')}
            >
              Return Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 