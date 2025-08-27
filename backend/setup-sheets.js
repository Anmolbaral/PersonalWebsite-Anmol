const { google } = require('googleapis');

// Instructions for setting up Google Sheets API
console.log(`
=== GOOGLE SHEETS API SETUP INSTRUCTIONS ===

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=anmol-portfolio-backend

2. Click "CREATE CREDENTIALS" → "Service Account"

3. Fill in:
   - Service account name: "portfolio-notes-logger"
   - Service account ID: "portfolio-notes-logger"
   - Description: "Service account for logging portfolio notes to Google Sheets"

4. Click "CREATE AND CONTINUE"

5. For "Grant this service account access to project":
   - Role: "Editor" (or "Google Sheets API" if available)
   - Click "CONTINUE"

6. Click "DONE"

7. Click on the created service account

8. Go to "KEYS" tab

9. Click "ADD KEY" → "Create new key" → "JSON"

10. Download the JSON file and save it as 'service-account-key.json' in this directory

11. Create a new Google Sheet at: https://docs.google.com/spreadsheets/create

12. Share the sheet with the service account email (found in the JSON file)

13. Copy the Sheet ID from the URL (the long string between /d/ and /edit)

14. Set the environment variables:
    - SHEET_ID: Your Google Sheet ID
    - GOOGLE_APPLICATION_CREDENTIALS: Path to service-account-key.json

Then run: npm run setup-sheets
`);

module.exports = { google };
