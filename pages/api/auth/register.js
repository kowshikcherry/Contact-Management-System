import User from "../../../models/User";
import sequelize from "../../../lib/db";
import { hashPassword } from "../../../utils/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }
  const { name, email, password } = req.body;
  try {
    await sequelize.sync();
    const hashedPassword = await hashPassword(password);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "User registration failed", details: error.message });
  }
}
