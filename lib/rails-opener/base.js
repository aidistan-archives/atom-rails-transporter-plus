'use babel'
import _ from 'lodash'
import { CompositeDisposable } from 'atom'
import RailsPath from '../rails-path'

/**
 * Super class of openers
 */
class BaseOpener {
  /**
   * @param {String} type
   */
  constructor (type) {
    this.type = type
    this.disposables = new CompositeDisposable()

    this.onNoneFound = null
    this.onSingleFound = null
    this.onMultipleFound = null
  }

  /**
   * Reactivate this opener and bind it to the key combination
   * @param {String} key a key combination
   */
  bind (key) {
    this.deactivate()
    if (_.isString(key) && key !== ' ') this.activate(key)
  }

  /**
   * Activate this opener and bind it to the key combination
   * @param {String} key a key combination
   */
  activate (key) {
    this.disposables.add(
      atom.commands.add('atom-text-editor', {
        [`rails-transporter-plus:open-${this.type}`]: () => this.trigger()
      }),
      atom.keymaps.add(`rails-transporter-plus/${this.type}`, {
        'atom-text-editor': { [`${key}`]: `rails-transporter-plus:open-${this.type}` }
      })
    )
  }

  deactivate () {
    this.disposables.dispose()
    this.disposables.clear()
  }

  trigger () {
    this.editor = atom.workspace.getActiveTextEditor()
    this.path = RailsPath.parse(this.editor.getPath())

    const files = this.find().map((p) => p.absolute)
    switch (files.length) {
      case 0:
        if (_.isFunction(this.onNoneFound)) {
          this.onNoneFound()
        } else {
          atom.notifications.addWarning(
            `No ${_.lowerCase(this.type)} to open for current file`,
            { dismissible: true }
          )
        }
        break
      case 1:
        if (_.isFunction(this.onSingleFound)) {
          this.onSingleFound(files[0])
        } else {
          if (this.editor.getPath() !== files[0]) {
            atom.workspace.open(files[0])
          }
        }
        break
      default:
        if (_.isFunction(this.onMultipleFound)) {
          this.onMultipleFound(files)
        } else {
          for (let file of files) {
            atom.workspace.open(file)
          }
        }
    }
  }

  /**
   * Find target paths to open. Usually is overwritten in descendents.
   * @return {RailsPath[]}
   */
  find () {
    return this.path.type ? this.path.mapTo(this.type) : []
  }
}

export default BaseOpener
