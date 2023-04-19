import { pid } from 'process';
import prisma from '../../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req, res) {
  // const productId = BigInt(req.query.id);

  const { productId, pname, pstock, pprice } = req.body;
  const id = BigInt(productId);
 
  const post = await prisma.products.update({
    where: { product_id: id },
    data: { product_name: pname,
        stock_amount: pstock,
        price: pprice, },
  });
  
  const json = JSON.stringify(post, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });
  
  res.json(json);
}