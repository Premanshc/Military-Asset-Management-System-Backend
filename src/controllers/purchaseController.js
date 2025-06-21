const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new purchase
exports.createPurchase = async (req, res) => {
  try {
    const { assetId, quantity } = req.body;
    const baseId = req.user.baseId;

    const purchase = await prisma.purchase.create({
      data: {
        assetId,
        quantity,
        baseId
      },
      include: {
        asset: true,
        base: true
      }
    });

    res.status(201).json({ message: 'Purchase recorded', purchase });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all purchases with optional filters
exports.getPurchases = async (req, res) => {
  try {
    const { assetId, baseId, startDate, endDate } = req.query;

    const filters = {};
    if (assetId) filters.assetId = parseInt(assetId);
    if (baseId) filters.baseId = parseInt(baseId);
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.gte = new Date(startDate);
      if (endDate) filters.createdAt.lte = new Date(endDate);
    }

    const purchases = await prisma.purchase.findMany({
      where: filters,
      include: {
        asset: true,
        base: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
