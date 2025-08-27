# Google Sheets Setup for Portfolio Notes

## Quick Setup (5 minutes)

### 1. Create a Google Sheet
1. Go to: https://docs.google.com/spreadsheets/create
2. Create a new spreadsheet
3. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - Sheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### 2. Set Environment Variable
Set the SHEET_ID environment variable in Cloud Run:

```bash
gcloud run services update portfolio-backend \
  --region us-central1 \
  --set-env-vars SHEET_ID="YOUR_SHEET_ID_HERE"
```

### 3. Deploy the Updated Backend
```bash
gcloud run deploy portfolio-backend --source . --platform managed --region us-central1 --allow-unauthenticated
```

### 4. Test the Integration
1. Submit a note through your website
2. Check your Google Sheet - it should automatically populate with the note data

## What Gets Logged
Each note will create a new row with:
- ID (timestamp)
- Timestamp
- Name
- Email
- Message
- Contact Info
- IP Address

## Viewing Notes
- **Google Sheet**: Direct access to all submitted notes
- **API Endpoint**: `https://portfolio-backend-zytbdwhcgq-uc.a.run.app/api/notes`

## Troubleshooting
- Make sure the Google Sheets API is enabled in your project
- Check Cloud Run logs for any errors
- Verify the SHEET_ID environment variable is set correctly
