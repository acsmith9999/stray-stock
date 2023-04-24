import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const cidStr = req.body.cid;
  const pidStr = req.body.pid;

  if (isNaN(cidStr) || isNaN(pidStr)) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
    const cid = BigInt(req.body.cid);
    const pid = BigInt(req.body.pid);

    const result = await prisma.product_components.create({
      data: {
        component_id: cid,
        product_id: pid,
        component_quantity: 1
      },
    });
    const json = JSON.stringify(result, (_key,value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    });
    res.json(json);
  }