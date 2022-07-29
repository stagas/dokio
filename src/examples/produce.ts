import * as fs from 'fs'
import sizeOfCb from 'image-size'
import normalize from 'normalize-package-data'
import * as path from 'path'
import { promisify } from 'util'

const sizeOf = promisify(sizeOfCb)

export type ExampleFile = {
  name: string
  fileName: string
  lang: string
  screenshot?: string
  screenshotDimensions?: {
    width: number
    height: number
  }
  link?: string
  contents: string
}

export const produce = async (): Promise<ExampleFile[]> => {
  try {
    const root = process.cwd()
    const pkg = await import(path.join(root, 'package.json'))
    normalize(pkg)
    const [user, repo] = pkg.repository.url.split('/').slice(-2)
    const pages = `https://${user}.github.io/${repo.split('.')[0]}/`
    const dir = path.join(root, 'example')
    const base = (x: string) => path.basename(x, path.extname(x))
    const join = (x: string) => path.join(dir, x)
    const asExt = (x: string, ext: string) => `${base(x)}.${ext}`
    const files = fs.readdirSync(dir).filter((x: any) => x.endsWith('.ts') || x.endsWith('.tsx'))

    const json: ExampleFile[] = []

    for (const x of files) {
      const file: ExampleFile = {
        name: path.basename(x, path.extname(x)),
        fileName: path.join('example', x),
        lang: path.extname(x).slice(1),
        screenshot: (fs.existsSync(join(asExt(x, 'png'))) && path.join('example', asExt(x, 'png')))
          || (fs.existsSync(join(asExt(x, 'webp'))) && path.join('example', asExt(x, 'webp')))
          || void 0,
        link: (fs.existsSync(join(asExt(x, 'html'))) && (pages + path.join('example', asExt(x, 'html'))))
          || void 0,
        contents: fs.readFileSync(join(x), 'utf8').replaceAll('../src', pkg.name).replaceAll('..', pkg.name),
      }
      if (file.screenshot)
        file.screenshotDimensions = await sizeOf(path.join(root, file.screenshot)) as any
      json.push(file)
    }

    return json
  } catch {
    return []
  }
}
