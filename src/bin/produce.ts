import * as fs from 'fs'
import getDimensions from 'get-video-width-height'
import * as path from 'path'

export type Bin = {
  name: string
  screenshot?: string
  screenshotDimensions?: {
    width: number
    height: number
  }
}

export const produce = async (): Promise<Partial<Bin>> => {
  const root = process.cwd()

  const pkg = await import(path.join(root, 'package.json'))
  if (!pkg.bin) return {}

  if (!fs.existsSync(path.join(root, 'cli.png'))) return {}

  const file: Bin = {
    name: Object.keys(pkg.bin)[0],
    screenshot: 'cli.png',
  }

  file.screenshotDimensions = await getDimensions(path.join(root, file.screenshot!))

  return file
}
