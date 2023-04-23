import prisma from '../../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req, res) {
  const { componentId, cname, cstock, cprice } = req.body;
  const id = BigInt(componentId);
 
  const post = await prisma.components.update({
    where: { component_id: id },
    data: { component_name: cname,
        stock_amount: cstock,
        price: cprice, },
  });
  
  const json = JSON.stringify(post, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });
  
  res.json(json);
}