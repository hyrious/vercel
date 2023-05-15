import http from 'node:http'
import https from 'node:https'

/** @type {import("@vercel/node").VercelApiHandler} */
export default async function handler(req, res) {
  const url = req.query.url || req.body
  if (!url) {
    return res.status(400).send('missing url')
  }

  const HTTP = url.startsWith('https') ? https : http
  HTTP.get(url, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers)
    proxyRes.pipe(res, { end: true })
  })
}
