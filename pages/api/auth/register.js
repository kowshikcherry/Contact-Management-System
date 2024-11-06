import User from "../../../models/User";
import sequelize from "../../../lib/db";
import { hashPassword } from "../../../utils/auth";
import crypto from "crypto";
import sendEmail from "../../../utils/email";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { name, email, password } = req.body;

  try {
    await sequelize.sync();

    const hashedPassword = await hashPassword(password);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    const verificationUrl = `http://localhost:3000/api/auth/verify?token=${verificationToken}`;

    const emailSubject = "Verify Your Email";
    await sendEmail(email, emailSubject, verificationUrl);

    res.status(201).json({
      message:
        "User registered successfully. Check your email for verification.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "User registration failed", details: error.message });
  }
}
