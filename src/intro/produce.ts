import * as fs from 'fs'
import * as path from 'path'

export type Intro = {
  intro: string
}

export const produce = async (): Promise<Intro> => {
  const root = process.cwd()

  let intro = ''

  for (const filename of ['INTRO.md', 'Intro.md', 'intro.md']) {
    const introMd = path.join(root, filename)
    if (fs.existsSync(introMd)) {
      intro = fs.readFileSync(introMd, 'utf-8')
      break
    }
  }

  return { intro }
}
