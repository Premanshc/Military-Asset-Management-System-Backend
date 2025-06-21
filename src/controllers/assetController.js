const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assets', details: err.message });
  }
};
