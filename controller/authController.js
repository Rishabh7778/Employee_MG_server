import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../middleware/jwt.js";

// Login controller: Generates both access and refresh tokens.
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userCheck = await User.findOne({ email });
    if (!userCheck) {
      return res
        .status(404)
        .json({ success: false, error: "User not found. Please try again!" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, userCheck.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password does not match" });
    }

    const payload = {
      id: userCheck._id,
      email: userCheck.email,
      role: userCheck.role,
      name: userCheck.name, 
    };

    // Generate tokens
    const token = generateToken(payload);
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_SECRET || "default_refresh_secret",
      { expiresIn: "7d" }
    );

    // Send response with tokens and user data
    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: { _id: userCheck._id, name: userCheck.name, role: userCheck.role },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify controller: Returns the user data (req.user is set by jwtAuthMiddleware)
// Optionally, you can generate a new access token here if needed.
const verify = async (req, res) => {
  try {
    // Query the database using the id from req.user
    const user = await User.findById(req.user.id);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Refresh Token Handler: Generates a new access token using a valid refresh token.
const refreshTokenHandler = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ error: "Refresh token not provided" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET || "default_refresh_secret",
    (err, userData) => {
      if (err)
        return res.status(403).json({ error: "Invalid refresh token" });

      // Generate a new access token using the data from the refresh token
      const newAccessToken = generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
      });
      res.json({ success: true, accessToken: newAccessToken });
    }
  );
};

export { login, verify, refreshTokenHandler };
