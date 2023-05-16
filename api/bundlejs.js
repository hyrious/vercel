import anafanafo from 'anafanafo'

/** @type {import("@vercel/node").VercelApiHandler} */
export default async function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'image/svg+xml;charset=utf-8',
    'Cache-Control': 'max-age=86400, s-maxage=86400',
    'Access-Control-Allow-Origin': '*',
  })

  const packageName = String(req.query.q)
  if (packageName) {
    const bundlejsUrl = new URL('https://deno.bundlejs.com/no-cache')
    bundlejsUrl.searchParams.set('q', packageName)

    const exports = req.query.exports
    if (exports) {
      bundlejsUrl.searchParams.set('treeshake', `[{${exports}}]`)
    }

    const response = await fetch(bundlejsUrl)
    if (response.ok) {
      const result = await response.json()
      // @ts-ignore
      const size = (result && result.size && result.size.size) || void 0
      const label = String(req.query.label) || void 0

      res.end(createSvg({ label, size }))
      return
    } else {
      console.error(await response.text())
    }
  }

  res.end(createSvg())
}

const FONT_SCALE_UP_FACTOR = 10
const WIDTH_FONT = '11px Verdana'
function createSvg({ label = 'minified size', size = 'unknown' } = {}) {
  const labelWidth = label.length ? preferredWidthOf(label, { font: WIDTH_FONT }) : 0
  const sizeWidth = preferredWidthOf(size, { font: WIDTH_FONT })

  const horizPadding = 5
  const leftWidth = labelWidth + 2 * horizPadding
  const rightWidth = sizeWidth + 2 * horizPadding
  const totalWidth = leftWidth + rightWidth

  const labelMargin = 1
  const sizeMargin = leftWidth - (size.length ? 1 : 0)

  const labelX = FONT_SCALE_UP_FACTOR * (labelMargin + 0.5 * labelWidth + horizPadding)
  const sizeX = FONT_SCALE_UP_FACTOR * (sizeMargin + 0.5 * sizeWidth + horizPadding)

  return `<svg
xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink"
width="${totalWidth}"
height="20"
role="img"
aria-label="${label}: ${size}"
>
<title>${label}: ${size}</title>
<linearGradient id="s" x2="0" y2="100%">
  <stop offset="0" stop-color="#bbb" stop-opacity=".1" />
  <stop offset="1" stop-opacity=".1" />
</linearGradient>
<clipPath id="r">
  <rect width="${totalWidth}" height="20" rx="3" fill="#fff" />
</clipPath>
<g clip-path="url(#r)">
  <rect width="${leftWidth}" height="20" fill="#555" />
  <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="#007ec6" />
  <rect width="${leftWidth + 10}" height="20" fill="url(#s)" />
</g>
<g
  fill="#fff"
  text-anchor="middle"
  font-family="Verdana,Geneva,DejaVu Sans,sans-serif"
  text-rendering="geometricPrecision"
  font-size="110"
>
  <text
    aria-hidden="true"
    x="${labelX}"
    y="150"
    fill="#010101"
    fill-opacity=".3"
    transform="scale(.1)"
    textLength="${FONT_SCALE_UP_FACTOR * labelWidth}"
  >
    ${label}
  </text>
  <text x="${labelX}" y="140" transform="scale(.1)" fill="#fff" textLength="${
    FONT_SCALE_UP_FACTOR * labelWidth
  }">
    ${label}
  </text>
  <text
    aria-hidden="true"
    x="${sizeX}"
    y="150"
    fill="#010101"
    fill-opacity=".3"
    transform="scale(.1)"
    textLength="${FONT_SCALE_UP_FACTOR * sizeWidth}"
  >
    ${size}
  </text>
  <text x="${sizeX}" y="140" transform="scale(.1)" fill="#fff" textLength="${
    FONT_SCALE_UP_FACTOR * sizeWidth
  }">
    ${size}
  </text>
</g>
</svg>
`
}

/**
 * @param {number} val
 */
function roundUpToOdd(val) {
  return val % 2 === 0 ? val + 1 : val
}

/**
 * @param {string} str
 * @param {{}} options
 * @returns {number}
 */
function preferredWidthOf(str, options) {
  return roundUpToOdd(anafanafo(str, options) | 0)
}
