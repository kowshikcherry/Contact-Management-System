import Contact from '../../../models/Contact'; 
import { validateContact } from '../../../utils/validation';
import dayjs from 'dayjs';
import { verifyToken } from '../../../utils/auth';

export default async function handler(req, res) {
    if (req.method === 'POST') {
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

        const contactsPayload = req.body; 
        const createdContacts = []; 
        const errors = []; 

        for (const contactData of contactsPayload) {
            const { name, email, phoneNumber, address, timezone } = contactData;

            try {
                await validateContact(contactData);

                
                const existingContact = await Contact.findOne({ 
                    where: { email, userId: user.id }
                });

                if (existingContact) {
                    errors.push({ email, message: 'Contact with this email already exists for this user' });
                    continue; 
                }

                
                const newContact = await Contact.create({
                    userId: user.id,
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
