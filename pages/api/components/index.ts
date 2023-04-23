import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    const { cname, cstock, cprice } = req.body;
  
    const result = await prisma.components.create({
      data: {
        component_name: cname,
        stock_amount: cstock,
        price: cprice,
      },
    });
    res.json(result);
  }