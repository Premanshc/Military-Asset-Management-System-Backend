const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate, baseId: queryBaseId, assetType } = req.query;
    const roleBaseId = req.user.baseId;
    const isAdmin = req.user.role === 'ADMIN';

    const baseId = isAdmin ? parseInt(queryBaseId) || undefined : roleBaseId;

    const dateFilter = (field = 'createdAt') =>
      startDate && endDate
        ? {
            [field]: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {};

    const assetFilter = assetType ? { type: assetType } : {};

    const [purchases, transfersIn, transfersOut, assignments, expenditures] = await Promise.all([
      prisma.purchase.groupBy({
        by: ['assetId'],
        where: {
          ...(baseId && { baseId }),
          ...dateFilter(),
        },
        _sum: { quantity: true },
      }),
      prisma.transfer.groupBy({
        by: ['assetId'],
        where: {
          ...(baseId && { toBaseId: baseId }),
          ...dateFilter(),
        },
        _sum: { quantity: true },
      }),
      prisma.transfer.groupBy({
        by: ['assetId'],
        where: {
          ...(baseId && { fromBaseId: baseId }),
          ...dateFilter(),
        },
        _sum: { quantity: true },
      }),
      prisma.assignment.groupBy({
        by: ['assetId'],
        where: {
          ...(baseId && { baseId }),
          ...dateFilter(),
        },
        _sum: { quantity: true },
      }),
      prisma.expenditure.groupBy({
        by: ['assetId'],
        where: {
          ...(baseId && { baseId }),
          ...dateFilter(),
        },
        _sum: { quantity: true },
      }),
    ]);

    const allAssetIds = new Set([
      ...purchases.map(p => p.assetId),
      ...transfersIn.map(t => t.assetId),
      ...transfersOut.map(t => t.assetId),
      ...assignments.map(a => a.assetId),
      ...expenditures.map(e => e.assetId),
    ]);

    const assets = await prisma.asset.findMany({
      where: {
        id: { in: Array.from(allAssetIds) },
        ...assetFilter,
      },
    });

    const dashboard = assets.map(asset => {
      const id = asset.id;
      const getQty = (list) => list.find(i => i.assetId === id)?._sum.quantity || 0;

      const p = getQty(purchases);
      const inT = getQty(transfersIn);
      const outT = getQty(transfersOut);
      const a = getQty(assignments);
      const e = getQty(expenditures);
      const closing = p + inT - outT - a - e;
      const netMovement = p + inT - outT;

      return {
        assetName: asset.name,
        assetType: asset.type,
        purchases: p,
        transfersIn: inT,
        transfersOut: outT,
        netMovement: netMovement,
        assigned: a,
        expended: e,
        closingBalance: closing,
      };
    });

    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const [totalBases, totalAssets, totalUsers] = await Promise.all([
      prisma.base.count(),
      prisma.asset.count(),
      prisma.user.count(),
    ]);

    res.json({ totalBases, totalAssets, totalUsers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
  }
};

exports.getAllBases = async (req, res) => {
  try {
    const bases = await prisma.base.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.json(bases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bases', details: err.message });
  }
};


// Commander Dashboard (No filters, limited to their base)
exports.getCommanderDashboardStats = async (req, res) => {
  try {
    const baseId = req.user.baseId;

    const [purchases, transfersIn, transfersOut, assignments, expenditures] = await Promise.all([
      prisma.purchase.groupBy({
        by: ['assetId'],
        where: { baseId },
        _sum: { quantity: true },
      }),
      prisma.transfer.groupBy({
        by: ['assetId'],
        where: { toBaseId: baseId },
        _sum: { quantity: true },
      }),
      prisma.transfer.groupBy({
        by: ['assetId'],
        where: { fromBaseId: baseId },
        _sum: { quantity: true },
      }),
      prisma.assignment.groupBy({
        by: ['assetId'],
        where: { baseId },
        _sum: { quantity: true },
      }),
      prisma.expenditure.groupBy({
        by: ['assetId'],
        where: { baseId },
        _sum: { quantity: true },
      }),
    ]);

    const allAssetIds = new Set([
      ...purchases.map(p => p.assetId),
      ...transfersIn.map(t => t.assetId),
      ...transfersOut.map(t => t.assetId),
      ...assignments.map(a => a.assetId),
      ...expenditures.map(e => e.assetId),
    ]);

    const assets = await prisma.asset.findMany({
      where: { id: { in: Array.from(allAssetIds) } },
    });

    const dashboard = assets.map(asset => {
      const id = asset.id;
      const getQty = (list) => list.find(i => i.assetId === id)?._sum.quantity || 0;

      const p = getQty(purchases);
      const inT = getQty(transfersIn);
      const outT = getQty(transfersOut);
      const a = getQty(assignments);
      const e = getQty(expenditures);
      const closing = p + inT - outT - a - e;

      return {
        assetName: asset.name,
        assetType: asset.type,
        purchases: p,
        transfersIn: inT,
        transfersOut: outT,
        assigned: a,
        expended: e,
        closingBalance: closing,
      };
    });

    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: 'Commander dashboard error', details: err.message });
  }
};