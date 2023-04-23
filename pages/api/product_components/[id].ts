import prisma from '../../../lib/prisma';

// DELETE 
export default async function handle(req, res) {
  const prodId = BigInt(req.query.pid);
  const compId = BigInt(req.query.cid)
  if (req.method === 'DELETE') {
    const post = await prisma.product_components.delete({
        where: { 
            product_id_component_id: {
              product_id: prodId,
              component_id: compId
            }
          },
    });
    const json = JSON.stringify(post, (_key, value) => {
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