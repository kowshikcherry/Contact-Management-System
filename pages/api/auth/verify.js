import User from "../../../models/User";
import sequelize from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send({ message: "Only GET requests allowed" });
  }

  const { token } = req.query;
  try {
    await sequelize.sync();

    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    await User.update(
      { isVerified: true, verificationToken: null },
      { where: { id: user.id } }
    );

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Verification failed", details: error.message });
  }
}
