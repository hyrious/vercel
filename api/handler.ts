import type { VercelApiHandler } from '@vercel/node'

export const handler: VercelApiHandler = async function handler(req, res) {
  res.status(200).json({ body: req.body, query: req.query })
}
