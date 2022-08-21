import markdown from 'markdown-it'
import * as os from 'os'
import * as path from 'path'

// const entities = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const trimLines = (s: string) => {
  const lines = s.split(/\r?\n/)

  // Trim head empty lines
  while (lines.length && lines[0].length === 0) lines.shift()

  // Trim tail empty lines
  while (lines.length && lines[lines.length - 1].length === 0) lines.pop()

  // Normalize data line endings
  return lines.join('\n')
}

export const numberOfLines = (s: string) => trimLines(s).split('\n').length

export const mdHighlight = (str: string, _lang: string) => `${trimLines(str)}`

export const md = markdown({ highlight: mdHighlight })

export const highlight = (str: string, lang: string) =>
  `<p>

\`\`\`${lang}
${trimLines(str)}
\`\`\`

</p>
`

const cwd = process.cwd()

export const sourcePath = (data: any) => {
  let pathname = path.join(os.homedir(), data.sources[0].fileName)
  if (pathname.indexOf(cwd) !== 0) return ''
  pathname = path.relative(cwd, pathname)
  return `${pathname}#L${data.sources[0].line}`
}

export const prettyBytes = (x: number) =>
  x < 1000
    ? `${x}b`
    : `${+((x / 1024).toFixed(1))}K`
