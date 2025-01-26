import db from "../config/Database.mjs";
import bcrypt from "bcrypt"
//Save the password reset request
export const saveResetRequestModel = async (email, code, expiresAt) => {
  const hashedCode = await bcrypt.hash(code, 10);
  await db.query(
    "INSERT INTO password_reset_requests(email, code, expires_at) VALUES (?, ?, ?)",
    [email, hashedCode, expiresAt]
  );
  return code;
};

//Verify the security code
export const verifyCodeModel = async (email, code) => {
  const [rows] = await db.query(
    "SELECT code FROM password_reset_requests WHERE email = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
    [email]
  );

  if (rows.length === 0) return false;

  const hashedCode = rows[0].code;
  return await bcrypt.compare(code, hashedCode);
};

//Invalidate all requests for an email
export const invalidateRequestsByEmailModel = async (email) => {
  await db.query("DELETE FROM password_reset_requests WHERE email = ?", [
    email,
  ]);
};

//Change the password in the `users` table
export const updateUserPasswordModel = async (email, hashedPassword) => {
  await db.query(" UPDATE users SET password_hash = ? WHERE email = ?", [
    hashedPassword,
    email,
  ]);
};


//Count recent code requests
export const countRecentRequestsModel = async (email, timeframeInHours = 2) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS request_count
      FROM password_reset_requests
      WHERE email = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? HOUR)
  `, [email, timeframeInHours]);
  return rows[0].request_count;
};

//Count recent verification attempts
export const countRecentAttemptsModel = async (email, timeframeInHours = 2) => {
  const [rows] = await db.query(`
      SELECT COUNT(*) AS attempt_count
      FROM password_reset_attempts
      WHERE email = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? HOUR)
  `, [email, timeframeInHours]);
  return rows[0].attempt_count;
};

//Record verification attempt
export const saveVerificationAttemptModel = async (email, success) => {
    await db.query(`
      INSERT INTO password_reset_attempts (email, success, created_at)
      VALUES (?, ?, NOW())
  `, [email, success]);
};
