import Contact from '../../../models/Contact'; 
import { validateAddContact } from '../../../utils/validation';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, name, email, phoneNumber, address, timezone } = req.body;

    try {
      await validateAddContact(req.body);

      const existingContact = await Contact.findOne({ where: { email } });
      if (existingContact) {
        return res.status(400).json({ message: 'Contact with this email already exists' });
      }

      const newContact = await Contact.create({
        userId,
        name,
        email,
        phoneNumber,
        address,
        timezone,
        created_at: dayjs().toISOString(), 
      });

      return res.status(201).json({
        message: 'Contact added successfully',
        contact: newContact,
      });

    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation Error',
          errors: error.errors || error.message || 'Invalid input',
        });
      }

      return res.status(500).json({
        message: 'Server error',
        error: error.message || 'An unexpected error occurred',
      });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
