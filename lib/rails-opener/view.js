'use babel'
import path from 'path'
import BaseOpener from './base'

export default class ViewOpener extends BaseOpener {
  find () {
    const cursorPos = this.editor.getLastCursor().getBufferPosition()
    const cursorLine = this.editor.getLastCursor().getCurrentBufferLine()
    const cursorInMatch = (regexpRes) =>
      cursorPos.column >= regexpRes.index &&
      cursorPos.column <= (regexpRes.index + regexpRes[0].length)

    const viewPath = (relativePath, type) => {
      const segs = relativePath.split(path.sep)
      const p = this.path.clone({
        action: path.sep + (type === 'partial' ? '_' : '') + segs.pop(),
        resource: type === 'layout' ? 'layouts' : segs.pop(),
        namespace: segs.map((s) => path.sep + s).join()
      })
      if (p.resource === undefined) p.resource = this.path.resource
      return p.mapTo('view', { shortNamespace: false })
    }

    if (['controller', 'mailer'].includes(this.path.type)) {
      if (cursorLine.indexOf('layout') !== -1) {
        let res = cursorLine.match(/layout\s*\(?\s*["'](.+?)["']/)
        if (res && res[1]) return viewPath(res[1], 'layout')
        res = cursorLine.match(/:?(?:layout)\s*(?:=>|:)\s*["'](.+?)["']/)
        if (res && cursorInMatch(res)) return viewPath(res[1], 'layout')
      }

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
        let res = cursorLine.match(/render\s*\(?\s*["'](.+?)["']/)
        if (res && res[1]) return viewPath(res[1], 'partial')
        res = cursorLine.match(/:?(?:partial)\s*(?:=>|:)\s*["'](.+?)["']/)
        if (res && res[1]) return viewPath(res[1], 'partial')
        res = cursorLine.match(/:?(?:template)\s*(?:=>|:)\s*["'](.+?)["']/)
        if (res && res[1]) return viewPath(res[1], 'template')
        // Partial layout has not been supported by now
      }
    }

    return []
  }
}
