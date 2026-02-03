import express from "express";
import { Support } from "../models/Support";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

// Send support message
router.post("/", async (req, res) => {
  try {
    const { name, email, category, subject, message, fullMessage } = req.body;
    
    // Determine priority based on category
    let priority = "medium";
    if (category === "technical") priority = "high";
    if (category === "account") priority = "urgent";
    
    const ticket = await Support.create({ 
      name, 
      email, 
      category: category || "general",
      subject: subject || "Support Request",
      message: fullMessage || message,
      priority
    });
    
    res.status(201).json({ message: "Support request sent", ticket });
  } catch (err) {
    res.status(500).json({ message: "Failed to send support request" });
  }
});

// Get all support tickets (Admin only)
router.get("/", authenticate, requireRole("ADMIN"), async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const tickets = await Support.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Support.countDocuments(filter);
    
    res.json({
      tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
});

// Get support ticket by ID (Admin only)
router.get("/:id", authenticate, requireRole("ADMIN"), async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch support ticket" });
  }
});

// Update support ticket (Admin only)
router.patch("/:id", authenticate, requireRole("ADMIN"), async (req, res) => {
  try {
    const { status, priority, assignedTo, response } = req.body;
    
    const ticket = await Support.findByIdAndUpdate(
      req.params.id,
      { status, priority, assignedTo, response },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }
    
    res.json({ message: "Support ticket updated", ticket });
  } catch (err) {
    res.status(500).json({ message: "Failed to update support ticket" });
  }
});

// Get support statistics (Admin only)
router.get("/stats/overview", authenticate, requireRole("ADMIN"), async (req, res) => {
  try {
    const total = await Support.countDocuments();
    const open = await Support.countDocuments({ status: "open" });
    const inProgress = await Support.countDocuments({ status: "in_progress" });
    const resolved = await Support.countDocuments({ status: "resolved" });
    const urgent = await Support.countDocuments({ priority: "urgent" });
    
    res.json({
      total,
      open,
      inProgress,
      resolved,
      urgent
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch support statistics" });
  }
});

export default router;
