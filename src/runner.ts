import { arg } from 'decarg'
import * as fs from 'fs'
import * as parts from '.'

export class Options {
  @arg('-o', '--outfile', 'Output filename (defaults to stdout)') outfile?: string = ''
  @arg('-e', '--expand', 'Expand all API details (useful while developing)') expand = false
  @arg('--', '[tsdoc args]', 'Arguments that will be passed to tsdoc') tsdoc: string[] = []

  constructor(options: Partial<Options> = {}) {
    Object.assign(this, options)
  }
}

export const run = async (options: Partial<Options>) => {
  let output = ''

  // cleaning our own options because tsdoc can't parse arguments properly
  process.argv.splice(2)
  process.argv.push(...options.tsdoc!)

  // highly opinionated defaults but can be overriden
  if (!process.argv.includes('--entryPoints'))
    process.argv.push('--entryPoints', 'src/index.ts')

  if (!process.argv.includes('--tsconfig'))
    process.argv.push('--tsconfig', 'tsconfig.dist.json')

  for (const part of ['header', 'bin', 'examples', 'intro', 'api', 'footer']) {
    const json = await (parts as any)[part].produce()
    const html = await (parts as any)[part].render(json, options)
    if (options.outfile) output += html
    else process.stdout.write(html)
  }
  if (options.outfile) fs.writeFileSync(options.outfile, output, 'utf8')
}
