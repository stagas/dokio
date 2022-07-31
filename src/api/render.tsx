/** @jsxImportSource html-jsx/tiny */
import type TypeDoc from 'typedoc'
import { md, sourcePath } from '../util'
import { ReflectionKind as Kind } from './kind'

const Comment = ({ text }: any) =>
  text
    ? `<p>

${text}

</p>
`
    : ''

const TypeNode = (type: any) => {
  if (!type?.type) return <></>
  return Types[type.type]?.(type) ?? type.type ?? ''
}

const Types: Record<any, (...args: any[]) => any> = {
  intrinsic: ({ name }) => <>{name}</>,
  indexedAccess: ({ indexType, objectType }) => (
    <>
      <TypeNode {...objectType} />
      {'[' + <TypeNode {...indexType} /> + ']'}
    </>
  ),
  reference: ({ id, name, typeArguments }) =>
    [
      id == null
        ? <span>{name}</span>
        : <a href={`#${name + '$' + id}`}>{name}</a>,
      typeArguments
        ? '&lt;' + typeArguments.map((type: any) => <TypeNode {...type} />).join(', ') + '&gt;'
        : '',
    ].join(''),
  array: ({ elementType }) => (
    <>
      <TypeNode {...elementType} />[]
    </>
  ),
  union: ({ types }) => (
    types.map((type: any) => <TypeNode {...type} />).join(' | ')
  ),
  literal: ({ value }) => <code>{JSON.stringify(value)}</code>,
  query: ({ queryType }) => (
    <>
      typeof <TypeNode {...queryType} />
    </>
  ),
  conditional: ({ checkType, extendsType, trueType, falseType }) => (
    <>
      {[
        <TypeNode {...checkType} />,
        'extends',
        <TypeNode {...extendsType} />,
        '?',
        <TypeNode {...trueType} />,
        ':',
        <TypeNode {...falseType} />,
      ].join(' ')}
    </>
  ),
  mapped: ({ parameter, parameterType, templateType, optionalModifier }) => (
    <>
      {'[' + parameter} in <TypeNode {...parameterType} />
      {']' + (optionalModifier ? optionalModifier + '?' : '') + ':'}
      <TypeNode {...templateType} />
    </>
  ),
  typeOperator: ({ operator, target }) => (
    <>
      {operator} <TypeNode {...target} />
    </>
  ),
  tuple: ({ elements }) => (
    <>
      [{(elements ?? []).map((type: any) => <TypeNode {...type} />).join(', ')}]
    </>
  ),
  intersection: ({ types }) => (
    types.map((type: any) => <TypeNode {...type} />).join(' &amp; ')
  ),
  reflection: ({ declaration }) => <Node {...declaration} />,
}

const Children = (data: any) => {
  const nodes = data[data.prop]?.map((x: any) => Kind[x.kind] === 'Reference' ? map.get(x.target) : x).filter((
    x: any,
  ) =>
    data.filter
      ? Kind[x.kind] === data.filter
      : true
  ).filter((x: any) => x.sources ? !x.sources[0].fileName.startsWith('..') : true)
  return !nodes?.length ? <></> : (
    <p>
      {data.filter && `<li><h4><em>${data.filter}</em></h4></li>`}
      {nodes.map((x: any) => <Node {...x} parent={data} />).join('')}
    </p>
  )
}

const Parameter = (x: any) => {
  if (Kind[x.type?.declaration?.kind] === 'TypeLiteral' && x.type.declaration.children?.length)
    return '{ ' + x.type.declaration.children.map((x: any) => <Parameter {...x} />).join(', ') + ' }'
  if (x.name === '__namedParameters') {
    return Types[x.type.type](x.type)
  }
  return x.name
}
const ParametersSimple = (data: any) => (data.parameters?.map(Parameter).join(', ') ?? '')
const TypeParameter = (
  data: any,
) => (data.typeParameter
  ? `&lt;${
    data.typeParameter.map((x: any) =>
      <span>{x.name}</span>
      + (x.type?.type === 'reference'
        ? (
          <>
            <span>{'&nbsp;extends&nbsp;'}</span> <TypeNode {...x.type} />
          </>
        )
        : '')
    ).join(', ')
  }&gt;`
  : '')

const Name = (
  data: any,
) => (data.name !== '__type' ? data.name : Kind[data.kind] === 'ConstructorSignature'
  ? 'new'
  : '')

const Nodes: Partial<Record<keyof typeof TypeDoc.ReflectionKind, (data: any) => string>> = Object.fromEntries(
  Object.keys(Kind).map(kind => [
    kind,
    (data: any) => {
      if (data.name === '<internal>' && data.kind === Kind.Namespace) {
        return data.children.map((child: any) => <Node {...child} />)
      }

      if (
        'Parameter' === kind && data.type?.type === 'reflection' && data.type?.declaration?.kind === Kind.TypeLiteral
        && data.type.declaration.signatures?.length === 1
        && data.type.declaration.signatures[0].kind === Kind.CallSignature
      ) {
        data = {
          id: data.id,
          parent: data.parent,
          name: data.name,
          kind: Kind.Function,
          signatures: [{ ...data.type.declaration.signatures[0], name: data.name }],
        }
        return <Node {...data} />
      }

      if (
        'Parameter' === kind
        && data.name === '__namedParameters'
        // && data.type?.declaration?.kind === Kind.TypeLiteral
      ) {
        return Types[data.type.type](data.type)

        // if (data.type?.type === 'reflection')
        // return <Node {...data.type.declaration} />
      }

      return (
        <details
          id={data.name + '$' + data.id}
          title={kind}
          open={globalExpand
            || (['Project', 'Module'].includes(Kind[data.parent?.kind]) && data.parent?.children?.length <= 2)
            || kind === 'Project'}
        >
          <summary>
            <span>
              <a href={`#${data.name + '$' + data.id}`}>#</a>
            </span>
            {(
              Name(data)
                ? (
                  <code>
                    <strong>
                      <Name {...data} />
                    </strong>
                  </code>
                )
                : ''
            )
              + (['Constructor', 'ConstructorSignature', 'Function', 'Method'].includes(kind)
                ? `<em>(${<ParametersSimple {...data?.signatures?.[0]} />})</em>`
                : '')}
            {data.defaultValue
              ? (
                <span>
                  <span>{'&nbsp;=&nbsp;'}</span>
                  <code>{data.defaultValue}</code>
                </span>
              )
              : ''}
            {(data.comment?.shortText && ' &ndash; ' + md.renderInline(data.comment.shortText))
              || (data.signatures?.[0]?.comment?.shortText
                && ' &ndash; ' + md.renderInline(data.signatures[0].comment.shortText))}
          </summary>
          {data.sources
            ? `<a href="${sourcePath(data)}">${sourcePath(data)}</a>`
            : ''}
          <ul>
            {data.type?.type
              ? (
                <p>
                  <TypeNode {...data.type} />
                </p>
              )
              : ''}
            <Comment {...data.comment} />
            <Children {...data} prop="signatures" />
            <Children {...data} prop="parameters" />
            {kind === 'Module'
              ? [
                'Function',
                'Variable',
                'Class',
                'Property',
                'Method',
                'Interface',
                'TypeAlias',
                'Enum',
                'EnumMember',
                'GetSignature',
                'SetSignature',
              ].map(x => <Children {...data} prop="children" filter={x} />).join('')
              : <Children {...data} prop="children" />}
          </ul>
        </details>
      )
    },
  ]).concat([
    [
      'TypeLiteral',
      data => {
        if (
          data.signatures?.length === 1
          && data.signatures[0].kind === Kind.CallSignature
        ) {
          data = { id: data.id, name: data.name, kind: Kind.Function, signatures: data.signatures }
          return <Node {...data} />
        }

        return ['{', <Children {...data} prop="signatures" />, <Children {...data} prop="children" />, '}'].join('')
      },
    ],
    ['CallSignature', data => {
      const returnType = data.type
      return (
        <>
          <Comment {...data.comment} />
          {data.parameters?.map(Node).join('') ?? ''}
          <p>
            {[
              <strong>
                <Name {...data} />
              </strong>,
              <TypeParameter {...data} />,
              `<em>(${<ParametersSimple {...data} />})</em>`,
            ].join('')}
            {'&nbsp;=&gt;'}
            <ul>
              <TypeNode {...returnType} />
            </ul>
          </p>
        </>
      )
    }],
  ])
)

const Node = (doc: any) => {
  if (doc.target) doc = map.get(doc.target)
  if (doc.sources && doc.sources[0].fileName.startsWith('..')) return <></>
  const kind = Kind[doc?.kind]
  const Child = Nodes[kind as keyof typeof Nodes]!
  if (Child) return <Child {...doc} />
  else return <></>
}

const map = new Map()
const withRefs = (doc: any) => {
  map.set(doc.id, doc)
  doc.children?.forEach(withRefs)
  return doc
}

let globalExpand = false

export const render = (doc: TypeDoc.JSONOutput.ProjectReflection, { expand = false }: { expand?: boolean } = {}) => {
  globalExpand = expand
  return `

## API

${<Children {...withRefs(doc)} expand={expand} prop="children" />}
`
}
