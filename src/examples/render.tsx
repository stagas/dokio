/** @jsxImportSource html-jsx/tiny */
import { highlight, numberOfLines } from '../util'

import type { ExampleFile } from '.'

const Example = ({ name, fileName, lang, screenshot, screenshotDimensions, link, contents }: ExampleFile) => {
  const dims = screenshotDimensions
  if (dims) {
    // TODO: hard code enforcing 1.75x for now
    dims.width = dims.width / 2 * (2 / 1.75)
    dims.height = dims.height / 2 * (2 / 1.75)
  }
  return (
    <details id={`example$${name}`} title={name} open={true}>
      <summary>
        <span>
          <a href={`#example$${name}`}>#</a>
        </span>
        <code>
          <strong>{name}</strong>
        </code>
      </summary>

      <ul>
        {(screenshot && link)
          ? (
            <>
              <p></p>
              <a href={link}>
                <img width={dims!.width} src={screenshot} />
                <p>
                  <strong>Try it live</strong>
                </p>
              </a>
            </>
          )
          : (screenshot)
          ? (
            <>
              <p></p>
              <img width={dims!.width} src={screenshot} />
            </>
          )
          : ''}

        {(!screenshot && link)
          ? (
            <p>
              <a href={link}>
                <strong>Try it live</strong>
              </a>
            </p>
          )
          : ''}

        <details
          id={`source$${name}`}
          title={`${name} source code`}
          open={!screenshot && numberOfLines(contents) < 15}
        >
          <summary>
            <span>
              <a href={`#source$${name}`}>#</a>
            </span>
            <code>
              <strong>view source</strong>
            </code>
          </summary>

          <a href={fileName}>{fileName}</a>

          {highlight(contents, lang)}
        </details>
      </ul>
    </details>
  )
}

export const render = (examples: ExampleFile[]) =>
  !examples?.length
    ? ''
    : `
## Examples

${examples.map(Example).join('')}
`

//   <details id="examples" title="examples" open={true}>
//     <summary>
//       <span>
//         <a href="#examples">#</a>
//       </span>
//       <code>
//         <strong>examples</strong>
//       </code>
//     </summary>

//     <p></p>

//   </details>
// ).replace(/```(\w+)/g, '\n\n```$1')
