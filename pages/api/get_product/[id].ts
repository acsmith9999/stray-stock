import prisma from '../../../lib/prisma';

// GET /api/products/:id
export default async function handle(req, res) {
  const id = BigInt(req.query.id);

  const product = await prisma.products.findUnique({
    where: { product_id: id },
  });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const json = JSON.stringify(product, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });

  return res.json(json);
}