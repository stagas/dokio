import * as td from 'typedoc'

export enum ExitCodes {
  Ok = 0,
  OptionError = 1,
  NoEntryPoints = 2,
  CompileError = 3,
  ValidationError = 4,
  OutputError = 5,
  ExceptionThrown = 6,
}

export const produce = async (): Promise<td.JSONOutput.ProjectReflection | ExitCodes> => {
  const app = new td.Application()

  process.argv.push(
    ...(`--readme none --emit docs --excludeExternals --excludeInternal --excludePrivate --excludeProtected`
      .split(' '))
  )
  app.options.addReader(new td.ArgumentsReader(0))
  app.options.addReader(new td.TypeDocReader())
  app.options.addReader(new td.TSConfigReader())
  app.options.addReader(new td.ArgumentsReader(300))

  app.bootstrap()

  const project = app.convert()
  if (!project)
    return ExitCodes.CompileError
  if (
    app.options.getValue('treatWarningsAsErrors')
    && app.logger.hasWarnings()
  ) {
    return ExitCodes.CompileError
  }

  app.validate(project)
  if (app.logger.hasErrors())
    return ExitCodes.ValidationError

  const json = app.serializer.projectToObject(project)

  json.name = 'api'

  return json
}
