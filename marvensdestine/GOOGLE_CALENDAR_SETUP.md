# Google Calendar API Setup Instructions

To enable automatic calendar booking, you need to set up Google Calendar API access.

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in service account details:
   - Name: `calendar-booking-service`
   - Description: `Service account for automatic calendar booking`
4. Click "Create and Continue"
5. Grant the service account these roles:
   - `Calendar API` > `Calendar Editor` (if available)
   - Or create custom role with calendar permissions
6. Click "Done"

## Step 3: Generate Service Account Key

1. Click on your newly created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file

## Step 4: Add Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Service Account Email (from your JSON file)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Service Account Private Key (from your JSON file)
# Important: Replace \n with actual line breaks
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----"
```

## Step 5: Share Calendar

1. Open Google Calendar
2. Go to `founder@blenderbin.com` calendar settings
3. In "Share with specific people", add your service account email
4. Give it "Make changes to events" permission

## Step 6: Test the Integration

1. Restart your development server
2. Try booking a discovery call
3. Check the console for success messages
4. Verify the event appears in `founder@blenderbin.com`'s calendar

## Troubleshooting

- **"Calendar API not available"**: Check environment variables
- **"Permission denied"**: Ensure calendar is shared with service account
- **"Invalid credentials"**: Verify private key format (line breaks matter!)

## Security Notes

- Never commit `.env.local` to version control
- Keep your service account key secure
- Consider using Google Cloud Secret Manager for production 