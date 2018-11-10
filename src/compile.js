const fs = require('fs')
const css = require('css')
const { getPropertyName, getStylesForProperty } = require('css-to-react-native')

const get = (v) => {
  return !parseFloat(v) ? `0` : `${parseFloat(v)} * ratio`
}

// pixel to points operand
const counter = 10

// allowed classe, map web values to native
const allowed = {
  'display': (v, k) => {
    switch (k) {
      case 'none':
        return `'none'`
        break
      case 'hidden':
        return `'none'`
        break
      case 'flex':
        return `'flex'`
        break
    }
  },
  'align': v => `'${v}'`,
  'justify': v => `'${v}'`,
  'width': (v, k) => (k == 'fit' || k == 'full') ? false : get(v),
  'height': (v, k) => (k == 'fit' || k == 'full') ? false : get(v),
  'mar': get,
  'mar-top': get,
  'mar-lef': get,
  'mar-rig': get,
  'mar-bot': get,
  'pad': get,
  'pad-top': get,
  'pad-lef': get,
  'pad-rig': get,
  'pad-bot': get,
}
let content = fs.readFileSync('./dist/build.min.css', 'utf8')
let ast = css.parse(content)
let template = `import { StyleSheet, PixelRatio } from 'react-native'

const ratio = PixelRatio.get()
export default StyleSheet.create({
`

for (let rule of ast.stylesheet.rules) {
  let selector = rule.selectors[0].replace(/[\\.]+/g, '')
  let parts = selector.split(':')
  let type = parts[0]
  let property = rule.declarations[0].property
  let name = getPropertyName(property)

  if (Object.keys(allowed).includes(type)) {
    let value = allowed[type](rule.declarations[0].value, parts[1])
    if (value) {
      template += `  '${selector}': {
    ${name}: ${value}
  },
`
    }
  }
}

// Additional & exceptional values
template += `  'fit': {
    flex: 1
  }
`

template += `})
`

fs.writeFileSync('./dist/native.js', template)
