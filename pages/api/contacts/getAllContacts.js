import Contact from '../../../models/Contact'; 
import { Op } from 'sequelize';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { name, email, timezone, sortBy, order = 'ASC' } = req.query;
        
        const whereClause = {};
        
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

        if (timezone) {
            whereClause.timezone = {
                [Op.like]: `%${timezone}%`, 
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

            return res.status(200).json({
                message: 'Contacts retrieved successfully',
                contacts,
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
