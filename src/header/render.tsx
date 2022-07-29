/** @jsxImportSource html-jsx/tiny */

import { prettyBytes } from '../util'
import type { Header } from './'

export const render = ({ brotli, pkg, loc }: Header) => `

<h1>
${pkg.name} \
<a href="https://npmjs.org/package/${pkg.name}"><img src="https://img.shields.io/badge/npm-v${pkg.version}-F00.svg?colorA=000"/></a> \
<a href="src"><img src="https://img.shields.io/badge/loc-${loc.SUM.code.toLocaleString()}-FFF.svg?colorA=000"/></a> \
${
  brotli
    ? `<a href="https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/dist/${pkg.name}.min.js"><img src="https://img.shields.io/badge/brotli-${
      prettyBytes(brotli)
    }-333.svg?colorA=000"/></a> `
    : ''
}<a href="LICENSE"><img src="https://img.shields.io/badge/license-${pkg.license}-F0B.svg?colorA=000"/></a>
</h1>

<p></p>

${pkg.description}

<h4>
<table><tr><td title="Triple click to select and copy paste">
<code>npm i ${pkg.name} ${pkg.bin ? '-g' : ''}</code>
</td><td title="Triple click to select and copy paste">
<code>pnpm add ${pkg.name} ${pkg.bin ? '-g' : ''}</code>
</td><td title="Triple click to select and copy paste">
<code>yarn ${pkg.bin ? 'global ' : ''}add ${pkg.name}</code>
</td></tr></table>
</h4>
`
