import Contact from "../../../models/Contact";
import rateLimiter from "../../../utils/rateLimiter";

export default async function handler(req, res) {
<<<<<<< HEAD
  await rateLimiter(req, res, async () => {
    if (req.method === "DELETE") {
=======
  if (req.method === "DELETE") {
    rateLimiter(req, res, async () => {
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
      const { id } = req.body;

      try {
        const contact = await Contact.findByPk(id);
        if (!contact) {
          return res.status(404).json({ message: "Contact not found" });
        }

<<<<<<< HEAD
        if (contact.userId !== req.user.id) {
          return res.status(403).json({
            message:
              "Access denied. You do not have permission to delete this contact.",
          });
        }

        await contact.update({ isActive: false });

=======
        if (contact.userId !== user.id) {
          return res
            .status(403)
            .json({
              message:
                "Access denied. You do not have permission to delete this contact.",
            });
        }

        await contact.update({ isActive: false });

>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
        return res.status(200).json({
          message: "Contact deleted successfully",
        });
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
