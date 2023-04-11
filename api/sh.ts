import type { VercelApiHandler } from '@vercel/node'
import cp from 'node:child_process'

const handler: VercelApiHandler = async function handler(req, res) {
  if (typeof req.body !== 'string') {
    res.status(400).send('missing header: "Content-Type: text/plain"')
    return
  }

  res.status(200)
  cp.exec(req.body).stdout?.pipe(res, { end: true }) ?? res.end()
}

export default handler
