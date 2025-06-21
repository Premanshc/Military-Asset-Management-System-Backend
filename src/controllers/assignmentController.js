const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Assign Asset
exports.createAssignment = async (req, res) => {
  const { assetId, assignedTo, quantity } = req.body;
  const baseId = req.user?.baseId;

  if (!assetId || !assignedTo || !quantity || !baseId) {
    return res.status(400).json({ error: 'Missing required fields or baseId from token' });
  }

  try {
    const assignment = await prisma.assignment.create({
      data: {
        assetId: parseInt(assetId),
        assignedTo,
        quantity: parseInt(quantity),
        baseId: parseInt(baseId),
      },
    });

    res.status(201).json({ message: 'Asset assigned.', assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Record Expenditure
exports.createExpenditure = async (req, res) => {
  const { assetId, reason, quantity } = req.body;
  const baseId = req.user?.baseId;

  if (!assetId || !reason || !quantity || !baseId) {
    return res.status(400).json({ error: 'Missing required fields or baseId from token' });
  }

  try {
    const expenditure = await prisma.expenditure.create({
      data: {
        assetId: parseInt(assetId),
        reason,
        quantity: parseInt(quantity),
        baseId: parseInt(baseId),
      },
    });

    res.status(201).json({ message: 'Asset expended.', expenditure });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Assignments
exports.getAssignments = async (req, res) => {
  try {
    const data = await prisma.assignment.findMany({
      include: {
        asset: true,
        base: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Expenditures
exports.getExpenditures = async (req, res) => {
  try {
    const data = await prisma.expenditure.findMany({
      include: {
        asset: true,
        base: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
