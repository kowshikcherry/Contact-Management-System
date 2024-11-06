import Contact from "../../../models/Contact";
import { validateContact } from "../../../utils/validation";
import dayjs from "dayjs";
import rateLimiter from "../../../utils/rateLimiter";

export default async function handler(req, res) {
<<<<<<< HEAD
  await rateLimiter(req, res, async () => {
    if (req.method === "POST") {
=======
  if (req.method === "POST") {
    rateLimiter(req, res, async () => {
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
      const contactsPayload = req.body;
      const createdContacts = [];
      const errors = [];

      for (const contactData of contactsPayload) {
        const { name, email, phoneNumber, address, timezone } = contactData;

        try {
          await validateContact(contactData);

          const existingContact = await Contact.findOne({
<<<<<<< HEAD
            where: { email, userId: req.user.id },
=======
            where: { email, userId: user.id },
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
          });

          if (existingContact) {
            errors.push({
              email,
              message: "Contact with this email already exists for this user",
            });
            continue;
          }

          const newContact = await Contact.create({
<<<<<<< HEAD
            userId: req.user.id,
=======
            userId: user.id,
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
            name,
            email,
            phoneNumber,
            address,
            timezone,
            created_at: dayjs().toISOString(),
          });

          createdContacts.push(newContact);
        } catch (error) {
          if (error.name === "ValidationError") {
            errors.push({
              email,
              message: "Validation Error",
              details: error.errors || error.message || "Invalid input",
            });
          } else {
            errors.push({
              email,
              message: "Server error",
              details: error.message || "An unexpected error occurred",
            });
          }
        }
      }

      return res.status(201).json({
        message: "Contacts processed successfully",
        createdContacts,
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
