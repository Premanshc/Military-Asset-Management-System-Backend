const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTransfer = async (req, res) => {
  try {
    const { assetId, toBaseId, quantity } = req.body;
    const fromBaseId = req.user.baseId;

    if (!fromBaseId) return res.status(400).json({ error: 'Sender base not linked to user' });
    // 🔥 Fix: parse all values to integers
    const parsedAssetId = parseInt(assetId);
    const parsedToBaseId = parseInt(toBaseId);
    const parsedQuantity = parseInt(quantity);
    const transfer = await prisma.transfer.create({
      data: {
        assetId: parsedAssetId,
        fromBaseId,
        toBaseId: parsedToBaseId,
        quantity: parsedQuantity,
      },
      include: {
        asset: true,
        fromBase: true,
        toBase: true,
      },
    });

    res.status(201).json({ message: 'Transfer recorded', transfer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransfers = async (req, res) => {
  try {
    const { assetId, fromBaseId, toBaseId, startDate, endDate } = req.query;

    const filters = {};
    if (assetId) filters.assetId = parseInt(assetId);
    if (fromBaseId) filters.fromBaseId = parseInt(fromBaseId);
    if (toBaseId) filters.toBaseId = parseInt(toBaseId);
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.gte = new Date(startDate);
      if (endDate) filters.createdAt.lte = new Date(endDate);
    }

    const transfers = await prisma.transfer.findMany({
      where: filters,
      include: {
        asset: true,
        fromBase: true,
        toBase: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
