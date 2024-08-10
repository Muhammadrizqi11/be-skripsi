import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan gambar menggunakan multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

export const getStudio = async (req, res) => {
  try {
    const studios = await prisma.studio.findMany();
    // Encode image buffer to base64
    const studiosWithBase64Images = studios.map((studio) => ({
      ...studio,
      image: studio.image ? studio.image.toString("base64") : null,
    }));
    res.status(200).json(studiosWithBase64Images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOwnerStudio = async (req, res) => {
  const { id } = req.params;
  try {
    const studio = await prisma.studio.findMany({
      where: { ownerId: parseInt(id) },
    });
    if (!studio) {
      return res.status(404).json({ error: "This Owner haven't any studio" });
    }

    res.status(200).json(studio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getStudioById = async (req, res) => {
  const { id } = req.params;
  try {
    const studio = await prisma.studio.findUnique({
      where: { id: parseInt(id) },
    });
    if (!studio) {
      return res.status(404).json({ error: "Studio not found" });
    }
    studio.image = studio.image.toString("base64");
    res.status(200).json(studio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createStudio = async (req, res) => {
  const { name, address, price, description, image, userId, paket } = req.body;

  const userData = await prisma.user.findFirst({ where: { id: Number(userId) } });

  if (userData.role !== "OWNER") return res.status(401).json({ error: "You are not owner" });

  // Konversi price dari string ke float
  const parsedPrice = parseInt(price);

  if (isNaN(parsedPrice)) {
    return res.status(400).json({ error: "Invalid price value" });
  }

  try {
    await prisma.studio.create({
      data: {
        name,
        address,
        price: parsedPrice,
        description,
        image, // Simpan data gambar ke dalam kolom image
        paket,
        ownerId: userData.id,
      },
    });
    return res.status(201).json({ msg: "Studio Created" });
  } catch (error) {
    console.error("===>", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateStudio = async (req, res) => {
  const { id } = req.params;
  const studioData = req.body;

  // Jika terdapat file gambar baru yang diunggah
  if (req.file) {
    studioData.image = req.file.buffer; // Ambil data gambar dari req.file.buffer
  }

  try {
    await prisma.studio.update({
      where: { id: parseInt(id) },
      data: studioData,
    });
    res.status(200).json({ msg: "Studio Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteStudio = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.pembayaran.deleteMany({
      where: {
        pemesanan: {
          studioId: parseInt(id),
        },
      },
    });

    const order = await prisma.pemesanan.deleteMany({
      where: {
        studioId: parseInt(id),
      },
    });

    if (order) {
      await prisma.studio.delete({
        where: { id: parseInt(id) },
      });
    }

    res.status(200).json({ msg: "Studio Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
