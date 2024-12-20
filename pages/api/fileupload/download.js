import Contact from "../../../models/Contact";
import { format as csvFormat } from "fast-csv";
import xlsx from "xlsx";
import rateLimiter from "../../../utils/rateLimiter";

export default async function handler(req, res) {
<<<<<<< HEAD
  await rateLimiter(req, res, async () => {
    if (req.method === "GET") {
=======
  if (req.method === "GET") {
    rateLimiter(req, res, async () => {
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
      const { format } = req.query;

      try {
        const contacts = await Contact.findAll({
          attributes: [
            "userId",
            "name",
            "email",
            "phoneNumber",
            "address",
            "timezone",
            "createdAt",
          ],
<<<<<<< HEAD
          where: { userId: req.user.id },
=======
          where: { userId: user.id },
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
        });

        const contactsData = contacts.map((contact) => ({
          userId: contact.userId,
          name: contact.name,
          email: contact.email,
          phoneNumber: contact.phoneNumber,
          address: contact.address,
          timezone: contact.timezone,
          createdAt: contact.createdAt.toISOString(),
        }));

        if (format === "csv") {
          res.setHeader("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="contacts.csv"'
          );

          const csvStream = csvFormat({ headers: true });
          csvStream.pipe(res);
          contactsData.forEach((contact) => csvStream.write(contact));
          csvStream.end();
        } else if (format === "excel") {
          const worksheet = xlsx.utils.json_to_sheet(contactsData);
          const workbook = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(workbook, worksheet, "Contacts");

          const buffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
          });

          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="contacts.xlsx"'
          );

<<<<<<< HEAD
          res.end(buffer);
=======
          res.send(buffer);
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
        } else {
          return res
            .status(400)
            .json({ message: 'Invalid format. Use "csv" or "excel".' });
        }
      } catch (error) {
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
