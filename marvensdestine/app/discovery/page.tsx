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
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
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
    const slots = generateTimeSlots();
    setTimeSlots(slots);
    
    // Auto-select the first available time slot
    const firstAvailable = slots.find(slot => slot.available);
    if (firstAvailable) {
      setSelectedTime(firstAvailable.time);
    }
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
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@company.com"
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
              <label>Project Type</label>
              <select
                value={formData.projectType}
                onChange={(e) => handleInputChange('projectType', e.target.value)}
              >
                <option value="">Select project type</option>
                <option value="3d-visualization">3D Visualization</option>
                <option value="product-design">Product Design</option>
                <option value="animation">Animation</option>
                <option value="web-experience">Web Experience</option>
                <option value="branding">Branding</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Budget Range</label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              >
                <option value="">Select budget range</option>
                <option value="5k-10k">$5K - $10K</option>
                <option value="10k-25k">$10K - $25K</option>
                <option value="25k-50k">$25K - $50K</option>
                <option value="50k-100k">$50K - $100K</option>
                <option value="100k+">$100K+</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Timeline</label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1-2-months">1-2 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-12-months">6-12 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Project Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us more about your project, goals, and any specific requirements..."
                rows={4}
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
              Thanks for scheduling your discovery call. We'll be in touch via email with additional details and a calendar invite.
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