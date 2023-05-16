import http from 'node:http'
import https from 'node:https'

/** @type {import("@vercel/node").VercelApiHandler} */
export default async function handler(req, res) {
  const url = req.query.url || req.body
  if (!url) {
    res.status(400).send('missing url')
    return
  }

  const HTTP = url.startsWith('https') ? https : http
  HTTP.get(url, (proxyRes) => {
    const headers = proxyRes.headers
    headers['access-control-allow-origin'] = '*'
    headers['access-control-allow-methods'] = 'GET'
    headers['access-control-allow-headers'] = 'Origin, Content-Type, Accept'
    res.writeHead(proxyRes.statusCode, headers)
    proxyRes.pipe(res, { end: true })
  })
}
