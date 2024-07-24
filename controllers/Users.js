import { PrismaClient } from "@prisma/client";
// import prisma from "../prismaClient.js"; // Import Prisma Client
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

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

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role: role || "USER", // Default role to USER if not provided
        instagram,
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

    res.json({ "accessToken":accessToken });
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
