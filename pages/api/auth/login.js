import User from "../../../models/User";
import sequelize from "../../../lib/db";
import { comparePassword, generateToken } from "../../../utils/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { email, password } = req.body;

  try {
    await sequelize.sync();
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
}
