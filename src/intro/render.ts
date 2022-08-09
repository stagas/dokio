import type { Intro } from './produce'

export const render = ({ intro }: Intro) =>
  intro && `

${intro}

`
