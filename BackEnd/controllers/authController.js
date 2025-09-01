import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginController = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ msg: "Login and password are required." });
  }

  try {
    const sql = "SELECT * FROM admins WHERE login = ?";
    const [results] = await pool.query(sql, [login]);

    if (results.length === 0) {
      return res.status(401).json({ msg: "Invalid credentials." });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials." });
    }

    const payload = { id: admin.id, login: admin.login };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ msg: "Server Error." });
  }
};