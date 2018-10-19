const fs = require('fs')
const css = require('css')
const { getPropertyName, getStylesForProperty } = require('css-to-react-native')

const allowed = [
  'display',
  'align',
  'justify',
  'float',
  'width',
  'height',
  'mar',
  'mar-top',
  'mar-lef',
  'mar-rig',
  'mar-bot',
  'pad',
  'pad-top',
  'pad-lef',
  'pad-rig',
  'pad-bot'
]
let content = fs.readFileSync('./dist/build.min.css', 'utf8')
let ast = css.parse(content)
let template = `import { StyleSheet } from 'react-native'

export default StyleSheet.create({
`

for (let rule of ast.stylesheet.rules) {
  let selector = rule.selectors[0].replace(/[\\.]+/g, '')
  let type = selector.split(':')[0]
  let property = rule.declarations[0].property
  let name = getPropertyName(property)
  let value = rule.declarations[0].value

  if (allowed.includes(type)) {
    let transform = getStylesForProperty(name, value)
    template += `  '${selector}': ${JSON.stringify(transform)},
`
  }
}

template += `})
`

fs.writeFileSync('./dist/native.min.js', template)
