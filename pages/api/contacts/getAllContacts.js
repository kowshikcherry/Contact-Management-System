import Contact from '../../../models/Contact'; 
import { Op } from 'sequelize';
import dayjs from 'dayjs'; 
import utc from 'dayjs/plugin/utc'; 
import timezone from 'dayjs/plugin/timezone'; 
import { verifyToken } from '../../../utils/auth'; 

dayjs.extend(utc);
dayjs.extend(timezone);

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

        const { name, email, timezone, sortBy, order = 'ASC', startDate, endDate } = req.query;
        
        const whereClause = {
            isActive: 1,
            userId: user.id, 
        };
        
        if (name) {
            whereClause.name = {
                [Op.like]: `%${name}%`, 
            };
        }

        if (email) {
            whereClause.email = {
                [Op.like]: `%${email}%`, 
            };
        }

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.gte]: new Date(startDate), 
                [Op.lte]: new Date(endDate), 
            };
        }

        const orderClause = [];
        if (sortBy) {
            orderClause.push([sortBy, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']);
        }

        try {
            const contacts = await Contact.findAll({
                where: whereClause,
                order: orderClause,
            });

            const contactsWithTimezone = contacts.map(contact => ({
                ...contact.toJSON(), 
                createdAt: dayjs(contact.createdAt).tz(timezone).format(), 
                updatedAt: dayjs(contact.updatedAt).tz(timezone).format(), 
            }));

            return res.status(200).json({
                message: 'Contacts retrieved successfully',
                contacts: contactsWithTimezone,
            });
        } catch (error) {
            console.error('Error retrieving contacts:', error);
            return res.status(500).json({
                message: 'Server error',
                error: error.message || 'An unexpected error occurred',
            });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
