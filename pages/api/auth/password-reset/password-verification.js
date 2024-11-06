import User from "../../../../models/User";
import sequelize from "../../../../lib/db";
import { hashPassword } from "../../../../utils/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { email, otc, newPassword } = req.body;

  try {
    await sequelize.sync();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (user.otc !== otc) {
      return res.status(400).json({ message: "Invalid OTC" });
    }

    if (new Date() > user.otc_expiry) {
      return res.status(400).json({ message: "OTC has expired" });
    }

    const hashedPassword = await hashPassword(newPassword);

    await user.update({
      password: hashedPassword,
      otc: null,
      otc_expiry: null,
    });

    return res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ error: "Password update failed", details: error.message });
  }
}
