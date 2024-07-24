// Import model Pembayaran dan dependencies yang diperlukan
import { PrismaClient } from "@prisma/client";
import midtransClient from "midtrans-client";
import axios from "axios";

const prisma = new PrismaClient();

// Mendapatkan semua pembayaran
export const getPembayaran = async (req, res) => {
  try {
    const pembayaran = await prisma.pembayaran.findMany();
    res.json(pembayaran);
  } catch (error) {
    res.status(500).json({ error: "Gagal mendapatkan pembayaran." });
  }
};

// Mendapatkan pembayaran berdasarkan ID
export const getPembayaranById = async (req, res) => {
  const { id } = req.params;
  try {
    const pembayaran = await prisma.pembayaran.findUnique({
      where: { id: parseInt(id) },
    });
    if (!pembayaran) {
      res.status(404).json({ error: "Pembayaran tidak ditemukan." });
    } else {
      res.json(pembayaran);
    }
  } catch (error) {
    res.status(500).json({ error: "Gagal mendapatkan pembayaran." });
  }
};

// Membuat pembayaran baru
export const createPembayaran = async (req, res) => {
  const { jumlah, metode, status, waktuBayar, pemesananId } = req.body;
  try {
    const newPembayaran = await prisma.pembayaran.create({
      data: {
        jumlah,
        metode,
        status,
        waktuBayar,
        pemesananId,
      },
    });
    res.status(201).json(newPembayaran);
  } catch (error) {
    res.status(500).json({ error: "Gagal membuat pembayaran baru." });
  }
};

// Mengupdate pembayaran berdasarkan ID
export const updatePembayaran = async (req, res) => {
  const { id } = req.params;
  const { jumlah, metode, status, waktuBayar, pemesananId } = req.body;
  try {
    const updatedPembayaran = await prisma.pembayaran.update({
      where: { id: parseInt(id) },
      data: {
        jumlah,
        metode,
        status,
        waktuBayar,
        pemesananId,
      },
    });
    res.json(updatedPembayaran);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengupdate pembayaran." });
  }
};

// Menghapus pembayaran berdasarkan ID
export const deletePembayaran = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.pembayaran.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Pembayaran berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus pembayaran." });
  }
};

const snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Endpoint untuk membuat transaksi
export const createPayment = async (req, res) => {
  try {
    const { amount, customerDetails } = req.body;

    const parameter = {
      transaction_details: {
        order_id: `order-id-${Math.floor(Math.random() * 1000000)}`, // unique order_id
        gross_amount: amount,
      },
      customer_details: customerDetails,
    };

    snap
      .createTransaction(parameter)
      .then((transaction) => {
        console.log("Midtrans transaction:", transaction);
        const transactionToken = transaction.token;
        const transactionRedirectUrl = transaction.redirect_url;
        res.json({ token: transactionToken, redirect_url: transactionRedirectUrl });
      })
      .catch((e) => {
        console.log("Midtrans error:", e);
        res.status(500).json({ message: "Something went wrong" });
      });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Endpoint untuk menerima notifikasi dari Midtrans
export const getNotification = async (req, res) => {
  const receivedJson = req.body;

  try {
    // const statusResponse = await snap.transaction.notification(receivedJson);
    // const { order_id: orderId, transaction_status: transactionStatus, fraud_status: fraudStatus } = statusResponse;

    // console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}.`);

    // let updateStatus = 'unknown';
    // if (transactionStatus === 'capture') {
    //   if (fraudStatus === 'challenge') {
    //     updateStatus = 'challenge';
    //   } else if (fraudStatus === 'accept') {
    //     updateStatus = 'success';
    //   }
    // } else if (transactionStatus === 'settlement') {
    //   updateStatus = 'success';
    // } else if (transactionStatus === 'cancel' ||
    //   transactionStatus === 'deny' ||
    //   transactionStatus === 'expire') {
    //   updateStatus = 'failure';
    // } else if (transactionStatus === 'pending') {
    //   updateStatus = 'pending';
    // }

    // // Update status di database
    // await prisma.pemesanan.update({
    //   where: { orderId }, // pastikan orderId sesuai dengan kolom yang ada di database
    //   data: { status: updateStatus },
    // });

    res.status(200).send("OK");
  } catch (error) {
    console.error("Failed to handle notification:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const cancelPembayaran = async (req, res) => {
  const { id } = req.params; // Mengambil id dari parameter rute
  const secret = process.env.MIDTRANS_SERVER_KEY;
  const encodedSecret = Buffer.from(secret).toString("base64");
  const basicAuth = `Basic ${encodedSecret}`;

  try {
    // Mencari pembayaran berdasarkan pemesananId
    const pembayaran = await prisma.pembayaran.findFirst({
      where: { pemesananId: parseInt(id) },
    });

    if (!pembayaran) {
      return res.status(404).json({ error: "Pembayaran tidak ditemukan" });
    }

    const transaction = await axios.post(
      `https://api.midtrans.com/v2/${pembayaran.code}/cancel`,
      {},
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: basicAuth,
        },
      }
    );

    // Memperbarui status pembayaran
    await prisma.pembayaran.update({
      where: { id: pembayaran.id },
      data: { status: "cancelled" },
    });

    res.status(200).json({ message: transaction.data.status_messaage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
