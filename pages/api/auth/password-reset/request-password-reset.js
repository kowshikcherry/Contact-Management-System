import User from "../../../../models/User";
import sequelize from "../../../../lib/db";
import crypto from "crypto";
import sendEmail from "../../../../utils/email";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { email } = req.body;

  try {
    await sequelize.sync();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const otc = crypto.randomInt(100000, 999999).toString();

    const otcExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await user.update({ otc, otc_expiry: otcExpiry });

    const url = `http://localhost:3000/api/auth/password-reset/password-reset-cerification?token=${otc}`;

    sendEmail(user.email, `Your password reset code is: ${otc}`, url);

    return res.json({ message: "Password reset code sent to email." });
  } catch (error) {
    console.error("Error in password reset request:", error);
    return res
      .status(500)
      .json({ error: "Password reset failed", details: error.message });
  }
}
