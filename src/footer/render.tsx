/** @jsxImportSource html-jsx/tiny */

import type { Footer } from '.'

const figureAuthorName = (dep: Footer['deps'][0]) => {
  let name = (dep.author?.name ?? dep.repository?.url)!
  if (name.includes('/')) name = name.split('/').slice(-2).shift()!
  if (name.includes('@') && name[0] !== '@') name = name.split('@')[0]
  return name
}

const figureAuthorUrl = (dep: Footer['deps'][0]) => {
  const url = (dep.author?.url ?? dep.repository?.url)!
  if (url.includes('github')) return 'https://github.com/' + url.split('/').slice(-2).shift()
  else return url
}

export const render = ({ deps, pkg }: Footer) => `
${
  deps.length
    ? `## Credits
` + deps.map(dep =>
      `- [${dep.name}](https://npmjs.org/package/${dep.name}) by [${figureAuthorName(dep)}](${
        figureAuthorUrl(dep)
      }) &ndash; ${dep.description}`
    ).join('\n')
    : ''
}

## Contributing

[Fork](https://github.com/${pkg.short}/fork) or [edit](https://github.dev/${pkg.short}) and submit a PR.

All contributions are welcome!

## License

<a href="LICENSE">${pkg.license}</a> &copy; ${new Date().getFullYear()} [${figureAuthorName(pkg)}](${
  figureAuthorUrl(pkg)
})
`
