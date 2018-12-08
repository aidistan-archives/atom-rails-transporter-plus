'use babel'
import path from 'path'
import BaseOpener from './base'

export default class ViewOpener extends BaseOpener {
  find () {
    const cursorPos = this.editor.getLastCursor().getBufferPosition()
    const cursorLine = this.editor.getLastCursor().getCurrentBufferLine()

    if (['controller', 'mailer'].includes(this.path.type)) {
      for (let rowNum = cursorPos.row; rowNum >= 0; rowNum--) {
        const row = this.editor.lineTextForBufferRow(rowNum)
        const res = row.match(/^\s*def\s+(\w+)/)

        if (res && res[1]) {
          this.path.action = path.sep + res[1]
          return this.path.mapTo('view')
        }
      }
    } else if (this.path.type === 'view') {
      if (cursorLine.indexOf('render') !== -1) {
        const partialPath = (filePath, actionPrefix = '_') => {
          const segs = filePath.split(path.sep)
          const p = this.path.clone({
            action: path.sep + actionPrefix + segs.pop(),
            resource: segs.pop(),
            namespace: segs.map((s) => path.sep + s).join()
          })
          if (p.resource === undefined) p.resource = this.path.resource
          return p.mapTo('view', { shortNamespace: false })
        }

        let res
        res = cursorLine.match(/render\s*\(?\s*["'](.+?)["']/)
        if (res && res[1]) return partialPath(res[1])
        res = cursorLine.match(/:?(?:partial)\s*(?:=>|:)\s*["'](.+?)["']/)
        if (res && res[1]) return partialPath(res[1])
        res = cursorLine.match(/:?(?:layout|template)\s*(?:=>|:)\s*["'](.+?)["']/)
        if (res && res[1]) return partialPath(res[1], '')
      }
    }

    return []
  }
}
