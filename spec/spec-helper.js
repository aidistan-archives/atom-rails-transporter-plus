'use babel'
import _ from 'lodash'
import _path_ from 'path'

// @return {String}
function root () {
  return atom.project.getPaths()[0]
}

// @return {String}
function path (...args) {
  return _path_.join.apply(this, _.flattenDeep([root(), args]))
}
path.sep = _path_.sep // for a little convenience

// @return {Promise}
function open (...args) {
  return atom.workspace.open(path(args))
}

// @return {undefined}
function dispatch (command) {
  let editorElement = atom.views.getView(atom.workspace.getActiveTextEditor())
  atom.commands.dispatch(editorElement, command)
}

// Must open fast
const CAN_NOT_WAIT = 10

export default { root, path, open, dispatch, CAN_NOT_WAIT }
