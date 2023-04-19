import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    const { pname, pstock, pprice } = req.body;
  
    const session = await getSession({ req });
    const result = await prisma.products.create({
      data: {
        product_name: pname,
        stock_amount: pstock,
        price: pprice,
      },
    });
    res.json(result);
  }