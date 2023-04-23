// pages/api/components/[id].ts

import prisma from '../../../lib/prisma';

// DELETE /api/components/:id
export default async function handle(req, res) {
  const compId = BigInt(req.query.id);
  if (req.method === 'DELETE') {
    const post = await prisma.components.delete({
      where: { component_id: compId },
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