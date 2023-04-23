import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    const { cid, pid, amount } = req.body;
  
    const result = await prisma.product_components.create({
      data: {
        component_id: cid,
        product_id: pid,
      },
    });
    res.json(result);
  }