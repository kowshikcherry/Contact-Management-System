import Contact from '../../../models/Contact'; 
import { format as csvFormat } from 'fast-csv';
import xlsx from 'xlsx';
import { verifyToken } from '../../../utils/auth'; 

export default async function handler(req, res) {
  if (req.method === 'GET') {
   
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    let user;
        try {
            user = verifyToken(token); 
        } catch (error) {
            return res.status(403).json({ message: error.message }); 
        }
    
    const { format } = req.query; 

    try {
      const contacts = await Contact.findAll({
        attributes: ['userId', 'name', 'email', 'phoneNumber', 'address', 'timezone', 'createdAt'],
        where: { userId: user.id }
      });

      const contactsData = contacts.map((contact) => ({
        userId: contact.userId,
        name: contact.name,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
        address: contact.address,
        timezone: contact.timezone,
        createdAt: contact.createdAt.toISOString(), 
      }));

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="contacts.csv"');

        const csvStream = csvFormat({ headers: true });
        csvStream.pipe(res); 
        contactsData.forEach((contact) => csvStream.write(contact));
        csvStream.end(); 
      } else if (format === 'excel') {
        const worksheet = xlsx.utils.json_to_sheet(contactsData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Contacts');

        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="contacts.xlsx"');

        res.send(buffer);
      } else {
        return res.status(400).json({ message: 'Invalid format. Use "csv" or "excel".' });
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Server error',
        error: error.message || 'An unexpected error occurred',
      });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
