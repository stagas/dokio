/** @jsxImportSource html-jsx/tiny */

import type { Bin } from '.'

export const render = ({ name, screenshot, screenshotDimensions }: Bin) =>
  !name ? '' : `
## CLI

<p></p>
<p>
<img width="${screenshotDimensions!.width / 2 * (2 / 1.75)}" src="${screenshot}" />
</p>
`
