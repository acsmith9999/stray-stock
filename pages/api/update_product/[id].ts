import { pid } from 'process';
import prisma from '../../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req, res) {
  const productId = req.query.id;
  console.log(productId);

  const { pid, pname, pstock, pprice } = req.body;
  const post = await prisma.products.update({
    where: { product_id: pid },
    data: { product_name: pname,
        stock_amount: pstock,
        price: pprice, },
  });
  res.json(post);
}