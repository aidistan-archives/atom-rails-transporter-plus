'use babel'
import path from 'path'
import pluralize from 'pluralize'
import conventions from '../rails-conventions'
import BaseOpener from './base'

export default class TestOpener extends BaseOpener {
  find () {
    return this.path.clone({
      type: this.type,
      dir: this.type + path.sep + pluralize.plural(this.path.type),
      suffix: this.path.suffix + conventions[this.type].path.suffix
    }).toIterator().run({ checkExistence: true, shortNamespace: false })
  }
}
