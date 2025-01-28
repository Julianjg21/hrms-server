import { findUserByEmailModel } from "../models/UserModel.mjs";
import {
  saveResetRequestModel,
  verifyCodeModel,
  invalidateRequestsByEmailModel,
  updateUserPasswordModel,
  countRecentRequestsModel,
  countRecentAttemptsModel,
  saveVerificationAttemptModel,
} from "../models/ResetPasswordModel.mjs";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const findEmailController = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "El correo es requerido." });
  }

  try {
    //Verify if the email is registered
    const emailExists = await findUserByEmail(email);
    if (!emailExists) {
      return res.status(404).json({
        message:
          "El correo ingresado no se encuentra registrado en el sistema.\n\nPor favor, inténtalo de nuevo.",
      });
    }

    // Verificar solicitudes recientes
    const recentRequests = await countRecentRequestsModel(email, 2);
    if (recentRequests >= 4) {
      return res.status(429).json({
        message:
          "Has alcanzado el límite de solicitudes. Intenta de nuevo en 2 horas.",
      });
    }

    const code = Math.floor(1000000 + Math.random() * 9000000).toString(); //Generate a 7 digit number
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); //Expires in 10 minutes

    await saveResetRequestModel(email, code, expiresAt);
    // Step 4: Enviar correo con el código de restablecimiento
     try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "julianjimenez2128@gmail.com",
          pass: "nivu qqds gvxa oaca",
        },
      });

      const mailOptions = {
        from: "Juventus Bar HRMS",
        to: email,
        subject: "Restablecimiento de Contraseña",
        html: `
        <div class="content" style="background-color: white; margin: 20px auto; padding: 20px; width: 90%; max-width: 600px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 8);">
          <h1 style="color:white;background-color:black; padding:2rem;">Juventus <span style="color:red;">Bar</span></h1>
          <h2 style="color: #333;">Recuperación de Contraseña</h2>
          <p>Has solicitado restablecer tu contraseña. Usa el siguiente código de recuperación:</p>
          <p style="font-size: 20px; font-weight: bold; color: #4CAF50;">${code}</p>
          <p>Este código es válido por 10 minutos.</p>
        </div>
        `,
      };

      // Step 5: Esperar a que el correo se envíe correctamente
      await transporter.sendMail(mailOptions);

      // Si el correo fue enviado correctamente, enviar una respuesta de éxito
      return res.status(200).json({
        message: "Código de restablecimiento enviado al correo.",
      });
    } catch (error) {
      // Si ocurre un error al enviar el correo
      return res.status(500).json({
        message: "Error al enviar el correo de restablecimiento",
        error: error.message,
      });
    }
    res
      .status(200)
      .json({ message: "Codigo enviado si el correo esta registrado." });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//verify the security code
export const verifyCodeController = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res
      .status(400)
      .json({ message: "El correo y el codigo son requeridos." });
  }

  try {
    // Verificar intentos recientes
    const recentAttempts = await countRecentAttemptsModel(email, 2);
    if (recentAttempts >= 4) {
      return res.status(429).json({
        message:
          "Has alcanzado el límite de intentos. Intenta de nuevo en 2 horas.",
      });
    }

    const isValid = await verifyCodeModel(email, code);

    // Registrar intento
    await saveVerificationAttemptModel(email, isValid);
    if (!isValid) {
      return res.status(400).json({ message: "Codigo invalido o expirado." });
    }
    res
      .status(200)
      .json({ message: "Código verificado. Procede a cambiar tu contraseña." });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//resetear contraseña

export const resetPasswordController = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Nueva contraseña requerida." });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordModel(email, hashedPassword);
    await invalidateRequestsByEmailModel(email); //Delete previous password reset requests

    res.status(200).json({ message: "Contraseña cambiada exitosamente." });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export default findEmailController;
