'use babel'
import _ from 'lodash'
import path from 'path'
import BaseOpener from './base'

export default class ModelOpener extends BaseOpener {
  find () {
    const cursorLine = this.editor.getLastCursor().getCurrentBufferLine()

    if (
      ['model', 'controller'].includes(this.path.type) &&
      cursorLine.indexOf('include') !== -1
    ) {
      const concernsPath = (moduleName) => {
        let p = this.path.clone({
          dir: this.path.dir + path.sep + 'concerns',
          resource: moduleName.split('::').map(_.snakeCase).join(path.sep),
          suffix: ''
        })
        return p.toIterator().run()
      }

      const res = cursorLine.match(/include\s+(.+)/)
      if (res && res[1]) return concernsPath(res[1])
    }

    return super.find()
  }
}
