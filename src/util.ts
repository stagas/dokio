import markdown from 'markdown-it'

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

export const sourcePath = (data: any) => {
  const fileName = data.sources[0].fileName.split('src/').pop()
  return `src/${fileName}#L${data.sources[0].line}`
}

export const prettyBytes = (x: number) =>
  x < 1000
    ? `${x}b`
    : `${+((x / 1024).toFixed(1))}K`
