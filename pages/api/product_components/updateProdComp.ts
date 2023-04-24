import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
    const pid = BigInt(req.body.pid);
    const cid = BigInt(req.body.cid);
    const amount = BigInt(req.body.amount);

    const post = await prisma.product_components.update({
        where: {product_id_component_id: {
                product_id: pid,
                component_id: cid}},
        data: {component_quantity: amount},
    });

    const json = JSON.stringify(post, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      });
      
      res.json(json);
}