import { showUI } from '@create-figma-plugin/utilities'
import setupHandlers from './common/handler';

export default function () {
  setupHandlers();
  showUI({
    height: 340,
    width: 240
  })
}
