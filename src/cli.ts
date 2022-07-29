#!/usr/bin/env node

import { decarg } from 'decarg'
import { Options, run } from './runner'

const options = decarg(new Options())!

run(options)
