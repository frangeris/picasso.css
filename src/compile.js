const fs = require('fs')
const css = require('css')
const { getPropertyName, getStylesForProperty } = require('css-to-react-native')

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
  'mar': v => `${parseFloat(v) * counter} * PixelRatio.get()`,
  'mar-top': v => `${parseFloat(v) * counter} * PixelRatio.get()`,
  'mar-lef': v => `${parseFloat(v) * counter} * PixelRatio.get()`,
  'mar-rig': v => `${parseFloat(v) * counter} * PixelRatio.get()`,
  'mar-bot': v => `${parseFloat(v) * counter} * PixelRatio.get()`,
  'pad': v => `${parseFloat(v) * counter} * PixelRatio.get()`,
  'pad-top': v => `${parseFloat(v) * counter} * PixelRatio.get()`,
  'pad-lef': v => `${parseFloat(v) * counter} * PixelRatio.get()`,
  'pad-rig': v => `${parseFloat(v) * counter} * PixelRatio.get()`,
  'pad-bot': v => `${parseFloat(v) * counter} * PixelRatio.get()`
}
let content = fs.readFileSync('./dist/build.min.css', 'utf8')
let ast = css.parse(content)
let template = `import { StyleSheet, PixelRatio } from 'react-native'

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
