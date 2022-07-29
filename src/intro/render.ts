import { md } from '../util'
import type { Intro } from './produce'

export const render = ({ intro }: Intro) =>
  intro && `
${md.render(intro)}
`
