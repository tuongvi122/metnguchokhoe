import { google } from 'googleapis';

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets.readonly']
);
const sheets = google.sheets({ version: 'v4', auth });

export default async function handler(req, res) {
  try {
    await auth.authorize();
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'DM SP!A2:J',
    });
    const rows = data.values || [];
    const products = rows.map(r => ({
      loaiDa: r[1] || '',
      tenDa: r[2] || '',
      hinhAnh: r[3] || '',
      latNen: r[4] || '',
      cauThang: r[5] || '',
      matTien: r[6] || '',
      bep: r[7] || '',
      cot: r[8] || '',
      tamCap: r[9] || ''
    }));
    res.status(200).json(products);
  } catch (err) {
    console.error("Lỗi hangmuc.js:", err);
    res.status(500).json({ error: 'Không lấy được dữ liệu: ' + err.message });
  }
}