import Contact from "../../../models/Contact";
import rateLimiter from "../../../utils/rateLimiter";

export default async function handler(req, res) {
  await rateLimiter(req, res, async () => {
    if (req.method === "DELETE") {
      const { id } = req.body;

      try {
        const contact = await Contact.findByPk(id);
        if (!contact) {
          return res.status(404).json({ message: "Contact not found" });
        }

        if (contact.userId !== req.user.id) {
          return res.status(403).json({
            message:
              "Access denied. You do not have permission to delete this contact.",
          });
        }

        await contact.update({ isActive: false });

        return res.status(200).json({
          message: "Contact deleted successfully",
        });
      } catch (error) {
        return res.status(500).json({
          message: "Server error",
          error: error.message || "An unexpected error occurred",
        });
      }
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  });
}
