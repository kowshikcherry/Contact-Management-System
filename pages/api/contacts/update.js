import { Op } from 'sequelize'; 
import Contact from '../../../models/Contact'; 
import { validateContact } from '../../../utils/validation'; 
import dayjs from 'dayjs';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const contactsPayload = req.body; 
        const updatedContacts = [];
        const errors = []; 

        for (const contactData of contactsPayload) {
            const { id, userId, name, email, phoneNumber, address, timezone } = contactData;

            try {
                await validateContact(contactData);

                const contact = await Contact.findByPk(id);
                if (!contact) {
                    errors.push({ id, message: 'Contact not found' });
                    continue;
                }

                const contactEmail = await Contact.findOne({
                    where: {
                        email: email,
                        id: {
                            [Op.ne]: id
                        }
                    }
                });
                if (contactEmail) {
                    errors.push({ id, email, message: 'Duplicate email found' });
                    continue; 
                }

                await contact.update({
                    userId,
                    name,
                    email,
                    phoneNumber,
                    address,
                    timezone,
                    updated_at: dayjs().toISOString(),
                });

                updatedContacts.push(contact);

            } catch (error) {
                if (error.name === 'ValidationError') {
                    errors.push({
                        id,
                        message: 'Validation Error',
                        details: error.errors || error.message || 'Invalid input',
                    });
                } else {
                    errors.push({
                        id,
                        message: 'Server error',
                        details: error.message || 'An unexpected error occurred',
                    });
                }
            }
        }

        return res.status(200).json({
            message: 'Contacts processed successfully',
            updatedContacts,
            errors,
        });
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
