import multer from "multer";
import csvParser from "csv-parser";
import xlsx from "xlsx";
import Contact from "../../../models/Contact";
import { validateContact } from "../../../utils/validation";
import rateLimiter from "../../../utils/rateLimiter";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const parseCSV = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const contacts = [];
    const readableStream = require("stream").Readable.from(fileBuffer);

    readableStream
      .pipe(csvParser())
      .on("data", (data) => contacts.push(data))
      .on("end", () => resolve(contacts))
      .on("error", (error) => reject(error));
  });
};

const parseExcel = (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

const bulkUpsertContacts = async (contacts) => {
  const bulkOperations = contacts.map(async (contact) => {
    await validateContact(contact);

    const existingContact = await Contact.findOne({
      where: { email: contact.email },
    });

    if (existingContact) {
      return existingContact.update(contact);
    } else {
      return Contact.create(contact);
    }
  });

  return Promise.all(bulkOperations);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await rateLimiter(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "File upload error", error: err.message });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file provided" });
      }

      let contacts = [];

      try {
        if (file.mimetype === "text/csv") {
          contacts = await parseCSV(file.buffer);
        } else if (
          file.mimetype ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.mimetype === "application/vnd.ms-excel"
        ) {
          contacts = await parseExcel(file.buffer);
        } else {
          return res.status(400).json({ message: "Unsupported file format" });
        }

        contacts.forEach((contact) => {
          contact.userId = req.user.id;
        });

        await bulkUpsertContacts(contacts);

        return res
          .status(201)
          .json({ message: "Contacts processed successfully" });
      } catch (error) {
        return res.status(500).json({
          message: "Server error",
          error: error.message || "An unexpected error occurred",
        });
      }
    });
  });
}
