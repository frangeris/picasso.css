const fs = require('fs')
const css = require('css')
const { getPropertyName, getStylesForProperty } = require('css-to-react-native')

const counter = 10
const allowed = {
  // 'flex'
  'display': (v, k) => {
    switch (k) {
      case 'none':
        return `'none'`
        break
      case 'hidden':
        return `'none'`
        break
      default:
        return `'flex'`
        break
    }
  },
  'align': v => `'${v}'`,
  'justify': v => `'${v}'`,
  'width': n => (n == '100vh') ? parseInt(n) * counter : false,
  'height': n => (n == '100vh') ? parseInt(n) * counter : false,
  'mar': n => parseFloat(n) * counter,
  'mar-top': n => parseFloat(n) * counter,
  'mar-lef': n => parseFloat(n) * counter,
  'mar-rig': n => parseFloat(n) * counter,
  'mar-bot': n => parseFloat(n) * counter,
  'pad': n => parseFloat(n) * counter,
  'pad-top': n => parseFloat(n) * counter,
  'pad-lef': n => parseFloat(n) * counter,
  'pad-rig': n => parseFloat(n) * counter,
  'pad-bot': n => parseFloat(n) * counter,
}
let content = fs.readFileSync('./dist/build.min.css', 'utf8')
let ast = css.parse(content)
let template = `import { StyleSheet } from 'react-native'

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

// add display

template += `})
`

fs.writeFileSync('./dist/native.js', template)
