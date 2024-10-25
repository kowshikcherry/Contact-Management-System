import Contact from "../../../models/Contact";
import { Op } from "sequelize";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import rateLimiter from "../../../utils/rateLimiter";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function handler(req, res) {
<<<<<<< HEAD
  await rateLimiter(req, res, async () => {
    if (req.method === "GET") {
=======
  if (req.method === "GET") {
    rateLimiter(req, res, async () => {
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
      const {
        name,
        email,
        timezone,
        sortBy,
        order = "ASC",
        startDate,
        endDate,
      } = req.query;

      const whereClause = {
        isActive: 1,
<<<<<<< HEAD
        userId: req.user.id,
=======
        userId: user.id,
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
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
        orderClause.push([
          sortBy,
          order.toUpperCase() === "DESC" ? "DESC" : "ASC",
        ]);
      }

      try {
        const contacts = await Contact.findAll({
          where: whereClause,
          order: orderClause,
        });

        const contactsWithTimezone = contacts.map((contact) => ({
          ...contact.toJSON(),
          createdAt: dayjs(contact.createdAt).tz(timezone).format(),
          updatedAt: dayjs(contact.updatedAt).tz(timezone).format(),
        }));

        return res.status(200).json({
          message: "Contacts retrieved successfully",
          contacts: contactsWithTimezone,
        });
      } catch (error) {
        console.error("Error retrieving contacts:", error);
        return res.status(500).json({
          message: "Server error",
          error: error.message || "An unexpected error occurred",
        });
      }
<<<<<<< HEAD
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  });
=======
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
}
