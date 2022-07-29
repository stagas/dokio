import * as fs from 'fs'
import normalize from 'normalize-package-data'
import * as path from 'path'

export type Footer = {
  deps: normalize.Package[]
  pkg: normalize.Package & { short?: string }
}

export const produce = async () => {
  const root = process.cwd()

  const pkg = await import(path.join(root, 'package.json'))
  normalize(pkg)

  const deps = []
  for (const dep in pkg.dependencies) {
    const depPkg = JSON.parse(fs.readFileSync(path.join(root, 'node_modules', dep, 'package.json'), 'utf8'))
    normalize(depPkg)
    deps.push(depPkg)
  }

  return { deps, pkg }
}
