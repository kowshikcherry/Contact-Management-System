import Contact from '../../../models/Contact'; 
import { validateContact } from '../../../utils/validation';
import dayjs from 'dayjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const contactsPayload = req.body; 
        const createdContacts = []; 
        const errors = []; 

        for (const contactData of contactsPayload) {
            const { userId, name, email, phoneNumber, address, timezone } = contactData;

            try {
                await validateContact(contactData);

                const existingContact = await Contact.findOne({ where: { email } });
                if (existingContact) {
                    errors.push({ email, message: 'Contact with this email already exists' });
                    continue; 
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

                createdContacts.push(newContact);

            } catch (error) {
                if (error.name === 'ValidationError') {
                    errors.push({
                        email,
                        message: 'Validation Error',
                        details: error.errors || error.message || 'Invalid input',
                    });
                } else {
                    errors.push({
                        email,
                        message: 'Server error',
                        details: error.message || 'An unexpected error occurred',
                    });
                }
            }
        }

        return res.status(201).json({
            message: 'Contacts processed successfully',
            createdContacts,
            errors,
        });
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
