import { render } from '@create-figma-plugin/ui'
import { h } from 'preact'
import Router from './ui/router'

function Plugin() {
  return <Router home='/' />
}

export default render(Plugin)
