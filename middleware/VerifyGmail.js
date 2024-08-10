import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_NODEMAILER,
      pass: process.env.PASS_NODEMAILER,
    },
  });

  const sendMail = transporter.sendMail({
    from: "Studiobook",
    to: "",
    subject: "",
    text: "",
  });
  console.log("email berhasil dikirim");
};
