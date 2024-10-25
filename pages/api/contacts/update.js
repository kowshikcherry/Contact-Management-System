import { Op } from "sequelize";
import Contact from "../../../models/Contact";
import { validateContact } from "../../../utils/validation";
import dayjs from "dayjs";
import rateLimiter from "../../../utils/rateLimiter";

export default async function handler(req, res) {
<<<<<<< HEAD
  await rateLimiter(req, res, async () => {
    if (req.method === "PUT") {
=======
  if (req.method === "PUT") {
    rateLimiter(req, res, async () => {
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
      const contactsPayload = req.body;
      const updatedContacts = [];
      const errors = [];

      for (const contactData of contactsPayload) {
<<<<<<< HEAD
        const { id, name, email, phoneNumber, address, timezone } = contactData;
=======
        const { id, userId, name, email, phoneNumber, address, timezone } =
          contactData;
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95

        try {
          await validateContact(contactData);

          const contact = await Contact.findByPk(id);
          if (!contact) {
            errors.push({ id, message: "Contact not found" });
            continue;
          }

<<<<<<< HEAD
          if (contact.userId !== req.user.id) {
            errors.push({
              id,
              message:
                "Access denied. You do not have permission to update this contact.",
            });
            continue;
          }

          const contactEmail = await Contact.findOne({
            where: {
              email: email,
              id: { [Op.ne]: id },
=======
          const contactEmail = await Contact.findOne({
            where: {
              email: email,
              id: {
                [Op.ne]: id,
              },
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
            },
          });
          if (contactEmail) {
            errors.push({ id, email, message: "Duplicate email found" });
            continue;
          }

          await contact.update({
<<<<<<< HEAD
=======
            userId,
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
            name,
            email,
            phoneNumber,
            address,
            timezone,
            updated_at: dayjs().toISOString(),
          });

          updatedContacts.push(contact);
        } catch (error) {
          if (error.name === "ValidationError") {
            errors.push({
              id,
              message: "Validation Error",
              details: error.errors || error.message || "Invalid input",
            });
          } else {
            errors.push({
              id,
              message: "Server error",
              details: error.message || "An unexpected error occurred",
            });
          }
        }
      }

      return res.status(200).json({
        message: "Contacts processed successfully",
        updatedContacts,
        errors,
      });
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
