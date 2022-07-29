import brotliSize from 'brotli-size'
import { execSync } from 'child_process'
import * as fs from 'fs'
import type normalize from 'normalize-package-data'
import * as path from 'path'

export type Header = {
  brotli?: number
  pkg: normalize.Package
  loc: any
}

export const produce = async (): Promise<Header> => {
  const root = process.cwd()

  const pkg = await import(path.join(root, 'package.json'))

  const distMin = path.join(root, 'dist', `${pkg.name}.min.js`)
  let brotli
  if (fs.existsSync(distMin)) {
    const code = fs.readFileSync(distMin, 'utf8')
    brotli = await brotliSize(code)
  }

  const loc = JSON.parse(execSync('cloc --json ' + path.join(root, 'src')).toString('utf8'))

  return { brotli, pkg, loc }
}
