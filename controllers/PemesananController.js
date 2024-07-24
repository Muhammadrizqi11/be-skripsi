import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Endpoint untuk membuat pemesanan dan pembayaran
export const createPemesanan = async (req, res) => {
  const { totalHarga, tanggalMulai, tanggalSelesai, durasi, studioId, userId } = req.body.datapemesanan;
  const { amount, customerDetails } = req.body;
  const code = `${customerDetails.first_name}-${Date.now()}`;

  try {
    // Siapkan parameter untuk transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: code,
        gross_amount: amount,
      },
      customer_details: customerDetails,
    };

    // Buat transaksi Midtrans
    const snapify = await snap.createTransaction(parameter);

    // Buat pemesanan
    const pemesanan = await prisma.pemesanan.create({
      data: {
        totalHarga,
        tanggalMulai,
        tanggalSelesai,
        durasi,
        studioId,
        userId,
      },
    });

    // Buat pembayaran
    await prisma.pembayaran.create({
      data: {
        jumlah: totalHarga,
        metode: "Midtrans",
        status: "pending",
        waktuBayar: new Date(),
        pemesananId: pemesanan.id,
        redirectUrl: snapify.redirect_url,
        code: code,
      },
    });

    return res.status(201).json({ token: snapify.token, redirect_url: snapify.redirect_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPemesanan = async (req, res) => {
  try {
    const pemesanan = await prisma.pemesanan.findMany();
    res.json(pemesanan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPemesananById = async (req, res) => {
  const { id } = req.params;
  try {
    const pemesanan = await prisma.pemesanan.findUnique({
      where: { id: parseInt(id) },
      include: {
        studio: true,
        pembayaran: true,
      },
    });

    if (!pemesanan) {
      return res.status(404).json({ message: "Pemesanan tidak ditemukan" });
    }

    // Mengonversi gambar studio ke base64
    let imageBase64 = null;
    if (pemesanan.studio && pemesanan.studio.image) {
      imageBase64 = pemesanan.studio.image.toString("base64");
    }

    const detailPemesanan = {
      ...pemesanan,
      studio: {
        ...pemesanan.studio,
        image: imageBase64,
      },
    };

    res.json(detailPemesanan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePemesanan = async (req, res) => {
  const { id } = req.params;
  const { totalHarga, tanggalMulai, tanggalSelesai, durasi, studioId, userId } = req.body;
  try {
    const pemesanan = await prisma.pemesanan.update({
      where: { id: parseInt(id) },
      data: { totalHarga, tanggalMulai, tanggalSelesai, durasi, studioId, userId },
    });
    res.json(pemesanan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePemesanan = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.pemesanan.delete({ where: { id: parseInt(id) } });
    res.json({ msg: "Pemesanan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all bookings for a specific studio
export const getBookingsForStudio = async (req, res) => {
  const { studioId } = req.params;
  try {
    const bookings = await prisma.pemesanan.findMany({
      where: { studioId: parseInt(studioId) },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Fungsi untuk mendapatkan riwayat pemesanan berdasarkan userId
export const getPemesananByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const pemesanan = await prisma.pemesanan.findMany({
      where: { userId: parseInt(userId) },
    });
    // Mengonversi gambar studio ke base64
    const pemesananwithstudio = await Promise.all(
      pemesanan.map(async (pesanan) => {
        const studio = await prisma.studio.findUnique({
          where: { id: pesanan.studioId },
        });

        let imageBase64 = null;
        if (studio && studio.image) {
          imageBase64 = studio.image.toString("base64");
        }

        return {
          ...pesanan,
          studio: {
            ...studio,
            image: imageBase64,
          },
        };
      })
    );

    res.json(pemesananwithstudio);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Endpoint untuk mendapatkan semua pemesanan berdasarkan studioId milik owner
export const getBookingsForOwner = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const studios = await prisma.pemesanan.findMany({
      where: {
        studio: { ownerId: parseInt(ownerId) },
      },
      include: {
        user: true,
        studio: true,
        pembayaran: true,
      },
    });

    if (!studios.length) {
      return res.status(404).json({ message: "No studios found for this owner" });
    }
    return res.status(200).json(studios);
  } catch (error) {
    console.error("Error fetching bookings for owner:", error);
    return res.status(500).json({ error: "Failed to fetch bookings for owner" });
  }
};
