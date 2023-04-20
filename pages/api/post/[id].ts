// pages/api/post/[id].ts

import prisma from '../../../lib/prisma';

// DELETE /api/post/:id
export default async function handle(req, res) {
  const prodId = BigInt(req.query.id);
  if (req.method === 'DELETE') {
    const post = await prisma.products.delete({
      where: { product_id: prodId },
    });
    const json = JSON.stringify(post, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      });
    res.json(json);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}