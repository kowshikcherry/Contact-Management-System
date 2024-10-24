import { Op } from 'sequelize'; 
import Contact from '../../../models/Contact'; 
import { validateContact } from '../../../utils/validation'; 
import dayjs from 'dayjs';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { id, userId, name, email, phoneNumber, address, timezone } = req.body;

        try {
            await validateContact(req.body); 
            
            const contact = await Contact.findByPk(id); 
            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' });
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
                return res.status(404).json({ message: 'Duplicate email found' });
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
            return res.status(200).json({
                message: 'Contact updated successfully',
                contact, 
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
