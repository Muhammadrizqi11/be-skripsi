import { PrismaClient } from "@prisma/client";
// import prisma from "../prismaClient.js"; // Import Prisma Client
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import nodemailer from "nodemailer";
const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

const sendVerificationEmail = async (userEmail, token) => {
  // Konfigurasi transporter dengan kredensial email
  const transporter = nodemailer.createTransport({
    service: "gmail", // Atau penyedia email lainnya
    auth: {
      user: process.env.USER_NODEMAILER, // Email untuk autentikasi
      pass: process.env.PASS_NODEMAILER, // Password untuk autentikasi
    },
  });

  // Buat link verifikasi
  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`; // Ganti dengan URL dasar aplikasi Anda

  // Kirim email verifikasi
  await transporter.sendMail({
    from: process.env.USER_NODEMAILER, // Email pengirim
    to: userEmail, // Email penerima
    subject: "Email Verification",
    html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
      <h2 style="color: #333;">Welcome to Studiobook!</h2>
      <p style="color: #555;">Thank you for signing up. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Email</a>
      </div>
      <p style="color: #555;">If the button above doesn't work, please copy and paste the following link into your browser:</p>
      <p style="color: #007bff;">${verificationLink}</p>
      <hr style="border-top: 1px solid #dddddd;" />
      <p style="color: #999; font-size: 12px;">If you did not create an account, please ignore this email.</p>
      <p style="color: #999; font-size: 12px;">© 2024 Your Company Name. All rights reserved.</p>
    </div>`,
  });

  console.log(`Email terkirim ke ${userEmail}`);
};

const generateRandomId = (length) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword, role, instagram } = req.body;

  // Validasi password
  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password dan Konfirmasi Password tidak cocok" });
  }

  // Validasi instagram untuk role OWNER
  if (role === "OWNER" && !instagram) {
    return res.status(400).json({ msg: "Instagram username diperlukan untuk pendaftaran owner" });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  // Buat token verifikasi menggunakan JWT
  const token = generateRandomId(32);
  // console.log({ email, token });
  await sendVerificationEmail(email, token);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role: role || "USER", // Default role to USER if not provided
        instagram,
        verify: false,
        verifyToken: token,
      },
    });

    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat registrasi" });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Email tidak ditemukan" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.json({ accessToken: accessToken });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await prisma.user.findUnique({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!user) return res.sendStatus(204);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: null,
    },
  });

  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Invalid token");
    }

    const user = await prisma.user.findFirst({
      where: { verifyToken: token },
    });

    if (!user) {
      return res.status(400).send("Invalid token");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verify: true,
        verifyToken: null,
      },
    });

    console.log(`Email ${user.email} berhasil terverifikasi`);

    res.send(` Email ${user.email} berhasil terverifikasi`);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
