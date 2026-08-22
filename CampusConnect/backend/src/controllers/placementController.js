import Placement from "../models/Placements.js";
import Notification from "../models/Notification.js";

// GET ALL PLACEMENTS (student + admin)
export const getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: placements,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch placements",
    });
  }
};

// CREATE PLACEMENT - ADMIN
export const createPlacement = async (req, res) => {
  try {
    const {
      company,
      role,
      type,
      description,
      package: pkg,
      location,
      eligibility,
      deadline,
      status,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: "Company and role are required",
      });
    }

    const placement = await Placement.create({
      company,
      role,
      type: type || "Full-time",
      description,
      package: pkg,
      location,
      eligibility,
      deadline,
      status: status || "Open",
      createdBy: req.user?._id,
    });

    // Best-effort notification — should never block placement creation.
    try {
      await Notification.create({
        title: "New Placement Opportunity 🚀",
        message: `${placement.company} is hiring for ${placement.role}`,
        channel: "in-app",
      });
    } catch (notifyError) {
      console.error("Notification creation failed:", notifyError);
    }

    return res.status(201).json({
      success: true,
      message: "Placement created successfully",
      data: placement,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create placement",
    });
  }
};

// UPDATE PLACEMENT - ADMIN
export const updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    return res.json({
      success: true,
      message: "Placement updated successfully",
      data: placement,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update placement",
    });
  }
};

// DELETE PLACEMENT - ADMIN
export const deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    return res.json({
      success: true,
      message: "Placement deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete placement",
    });
  }
};

// APPLY TO PLACEMENT - STUDENT
export const applyToPlacement = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is required to apply",
      });
    }

    const placement = await Placement.findById(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    if (!placement.applicants.includes(user)) {
      placement.applicants.push(user);
      await placement.save();
    }

    return res.json({
      success: true,
      message: "Application submitted successfully",
      data: placement,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to apply to placement",
    });
  }
};
