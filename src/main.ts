import {  showUI } from '@create-figma-plugin/utilities'
import handlers from './handlers'
import setupHandlers from './handlers';

export default function () {
  setupHandlers();
  showUI({
    height: 280,
    width: 240
  })
}
