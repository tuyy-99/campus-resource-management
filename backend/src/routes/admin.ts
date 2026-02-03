import express from "express";
import { User } from "../models/User";
import { Resource } from "../models/Resource";
import { Request } from "../models/Request";
import { Support } from "../models/Support";

const router = express.Router();

router.get("/overview", async (_req, res) => {
  try {
    const users = await User.countDocuments();
    const resources = await Resource.countDocuments();
    const requests = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: "PENDING" });
    const supportTickets = await Support.countDocuments();
    const openTickets = await Support.countDocuments({ status: "open" });

    res.json({ 
      users, 
      resources, 
      requests, 
      pending,
      supportTickets,
      openTickets
    });
  } catch {
    res.status(500).json({ message: "Failed to load stats" });
  }
});

export default router;
