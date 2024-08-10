import nodemailer from "nodemailer";

export const sendVerificationEmail = async () => {
  // Konfigurasi transporter dengan kredensial email
  const transporter = nodemailer.createTransport({
    service: "gmail", // Atau penyedia email lainnya
    auth: {
      user: "mhmmdrizqi2002@gmail.com", // Email untuk autentikasi
      pass: "llizeyuashnzvwwt", // Password untuk autentikasi
    },
  });

  // Buat link verifikasi
  const verificationLink = `http://localhost:5000/api/verify-email?token=initokenya`; // Ganti dengan URL dasar aplikasi Anda

  // Kirim email verifikasi
  await transporter.sendMail({
    from: process.env.USER_NODEMAILER, // Email pengirim
    to: "waridiw967@eixdeal.com", // Email penerima
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
    html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
  });

  console.log(`Email terkirim`);
};

sendVerificationEmail();
