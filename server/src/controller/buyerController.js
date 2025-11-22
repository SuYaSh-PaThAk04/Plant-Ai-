import Buyer from "../models/Buyer.Modal.js";

// ---------------------------------------------
// GET ALL BUYERS (with filtering + pagination)
// ---------------------------------------------
export const getAllBuyers = async (req, res) => {
  try {
    const {
      crop,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};

    if (crop) filter.crop = crop;
    if (location) filter.location = location;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    const buyers = await Buyer.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Buyer.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: buyers,
    });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------------------------------------
// GET SINGLE BUYER
// ---------------------------------------------
export const getBuyerById = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer)
      return res
        .status(404)
        .json({ success: false, message: "Buyer not found" });

    res.json({ success: true, data: buyer });
  } catch (error) {
    console.error("Error fetching buyer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------------------------------------
// CREATE BUYER
// ---------------------------------------------
export const createBuyer = async (req, res) => {
  try {
    const newBuyer = await Buyer.create(req.body);
    res.status(201).json({ success: true, data: newBuyer });
  } catch (error) {
    console.error("Error creating buyer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------------------------------------
// UPDATE BUYER
// ---------------------------------------------
export const updateBuyer = async (req, res) => {
  try {
    const updated = await Buyer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Buyer not found" });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating buyer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------------------------------------
// DELETE BUYER
// ---------------------------------------------
export const deleteBuyer = async (req, res) => {
  try {
    const deleted = await Buyer.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Buyer not found" });

    res.json({ success: true, message: "Buyer deleted successfully" });
  } catch (error) {
    console.error("Error deleting buyer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------------------------------------
// GET STATS
// ---------------------------------------------
export const getBuyerStats = async (req, res) => {
  try {
    const stats = await Buyer.aggregate([
      {
        $group: {
          _id: "$crop",
          totalBuyers: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { totalBuyers: -1 } },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
