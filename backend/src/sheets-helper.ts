import { google } from 'googleapis';

interface Note {
  id: string;
  name: string;
  email: string;
  message: string;
  contactInfo: string;
  timestamp: string;
  ip: string;
}

class SheetsHelper {
  private sheets: any;
  private sheetId: string;

  constructor() {
    this.sheetId = process.env.SHEET_ID || '';
    
    // Initialize Google Sheets API using default credentials
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async initializeSheet() {
    if (!this.sheetId) {
      console.error('SHEET_ID environment variable not set');
      return false;
    }

    try {
      // Set up headers
      const headers = [
        'ID',
        'Timestamp',
        'Name',
        'Email',
        'Message',
        'Contact Info',
        'IP Address'
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetId,
        range: 'A1:G1',
        valueInputOption: 'RAW',
        resource: {
          values: [headers]
        }
      });

      // Format headers
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.sheetId,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 7
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.2, green: 0.6, blue: 0.9 },
                    textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)'
              }
            }
          ]
        }
      });

      console.log('Google Sheet initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Google Sheet:', error);
      return false;
    }
  }

  async addNote(note: Note) {
    if (!this.sheetId) {
      console.error('SHEET_ID environment variable not set');
      return false;
    }

    try {
      const values = [
        [
          note.id,
          note.timestamp,
          note.name,
          note.email,
          note.message,
          note.contactInfo,
          note.ip
        ]
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: 'A:G',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values
        }
      });

      console.log(`Note logged to Google Sheet: ${note.name} (${note.email})`);
      return true;
    } catch (error) {
      console.error('Error adding note to Google Sheet:', error);
      return false;
    }
  }

  async getAllNotes(): Promise<Note[]> {
    if (!this.sheetId) {
      console.error('SHEET_ID environment variable not set');
      return [];
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'A2:G', // Skip header row
      });

      const rows = response.data.values || [];
      
      return rows.map((row: any[]) => ({
        id: row[0] || '',
        timestamp: row[1] || '',
        name: row[2] || '',
        email: row[3] || '',
        message: row[4] || '',
        contactInfo: row[5] || '',
        ip: row[6] || ''
      }));
    } catch (error) {
      console.error('Error reading notes from Google Sheet:', error);
      return [];
    }
  }
}

export default SheetsHelper;
