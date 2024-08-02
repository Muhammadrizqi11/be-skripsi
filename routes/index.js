import express from "express";
import { getStudio, getStudioById, createStudio, updateStudio, deleteStudio, getOwnerStudio } from "../controllers/StudioModel.js";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { verifyToken, authorizeRole } from "../middleware/VerifyToken.js";
import { createPemesanan, getPemesanan, getPemesananById, updatePemesanan, deletePemesanan, getBookingsForStudio, getPemesananByUserId, getBookingsForOwner } from "../controllers/PemesananController.js";
import { getPembayaran, getPembayaranById, createPembayaran, updatePembayaran, deletePembayaran, createPayment, getNotification, cancelPembayaran } from "../controllers/PembayaranController.js";
// import { refreshToken } from "../controller/RefreshToken.js";

const router = express.Router();

// verifyToken, authorizeRole("OWNER")
// route studio
router.get("/studio", getStudio);
router.get("/studio/owner/:id", getOwnerStudio);
router.get("/studio/:id", getStudioById);
router.post("/studio", createStudio);
router.patch("/studio/:id", updateStudio);
router.delete("/studio/:id", deleteStudio);

// route user
router.get("/users", getUsers);
router.post("/users", Register);
router.post("/login", Login);
// router.get("/token", refreshToken);
router.delete("/logout", Logout);

// route pemesanan
router.post("/pemesanan", createPemesanan);
router.get("/pemesanan", getPemesanan);
router.get("/pemesanan/:id", getPemesananById);
router.put("/pemesanan/:id", updatePemesanan);
router.delete("/pemesanan/:id", deletePemesanan);
router.get("/pemesanan/owner/:ownerId", getBookingsForOwner);
router.post("/pembayaran/cancel/:id", cancelPembayaran);

//route pembayaran
router.get("/pembayaran", getPembayaran);
router.get("/pembayaran/:id", getPembayaranById);
router.post("/pembayaran", createPembayaran);
router.put("/pembayaran/:id", updatePembayaran);
router.delete("/pembayaran/:id", deletePembayaran);

router.get("/pemesanan/studio/:studioId", getBookingsForStudio);

// api payment gateway
router.post("/api/trancation", createPayment);
router.get("/api/notification", (req, res) => res.status(201).json({ message: "OK" }));
router.post("/api/notification", getNotification);

// Tambahkan rute untuk mendapatkan riwayat pemesanan berdasarkan userId
router.get("/pemesanan/user/:userId", getPemesananByUserId);

export default router;
