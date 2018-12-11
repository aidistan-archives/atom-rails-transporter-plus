'use babel'
import _ from 'lodash'
import path from 'path'
import conventions from '../rails-conventions'
import RailsPathIterator from './iterator'

/**
 * Utility class for handling rails path
 *
 * @example <caption>Following shows the relationships between the properties</caption>
 * path = (/root/ + dir + /namespace) + / + (resource + /action + suffix) + ext
 *                _.dir                                _.name
 */
class RailsPath {
  /**
   * Parse given file path
   * @param  {String} filePath
   * @return {RailsPath}
   */
  static parse (filePath) {
    const p = new RailsPath(filePath)

    for (let type in conventions) {
      let conv = conventions[type].path

      if (
        p._.base.search(conv.tailRegExp) !== -1 &&
        atom.project.relativize(filePath).search(conv.dirRegExp) !== -1
      ) {
        p.type = type
        p.root = p._.dir.split(conv.dirRegExp).shift()
        p.dir = conv.dirRegExp.exec(p._.dir)[0]
        p.namespace = p._.dir.split(conv.dirRegExp).pop()
        p.resource = p._.base.replace(conv.tailRegExp, '')
        p.suffix = conv.suffix
        p.ext = conv.tailRegExp.exec(p._.base)[1]

        return _.tap(p, conv.adjust)
      }
    }

    return p
  }

  /** @param {String} filePath */
  constructor (filePath) {
    Object.assign(this,
      { _: path.parse(filePath), type: '', ext: '' },
      { root: '', dir: '', namespace: '' },
      { resource: '', action: '', suffix: '' }
    )
  }

  /** @return {String} */
  get absolute () {
    return this.type === 'view'
      ? this.root + this.dir + this.namespace + path.sep +
        this.resource + this.action + this.suffix + this.ext
      : this.root + this.dir + this.namespace + path.sep +
        this.resource + this.suffix + this.ext
  }

  /** @return {String} */
  get relative () {
    return atom.project.relativize(this.absolute)
  }

  /**
   * @return {Object} path.parse(this.absolute)
   */
  get $ () {
    return path.parse(this.absolute)
  }

  /**
   * Clone to a new {@link RailsPath} object
   * @param  {Object} [properties={}]
   * @return {RailsPath}
   */
  clone (properties = {}) {
    return _.assign(_.clone(this), properties)
  }

  /**
   * Build a {@link RailsPathIterator} with `this` as the base
   * @param  {Object} space {@link RailsPathIterator}
   * @return {RailsPathIterator}
   */
  toIterator (space) {
    return new RailsPathIterator(this, space)
  }

  /**
   * Map to given type {@link RailsPath}s
   * @param  {String}  type
   * @param  {Object}  [options]
   * @param  {Boolean} [options.checkExistence=true] whether to check existence
   * @param  {Boolean} [options.shortNamespace=true] whether to traverse namespaces
   * @return {RailsPath[]}
   */
  mapTo (type, { checkExistence = true, shortNamespace = true } = {}) {
    // Check the convention
    let conv = conventions[type].path
    if (type === 'view' && _.isEmpty(this.action)) {
      throw new TypeError("Can't map to view without an action")
    } else if (_.isEmpty(conv.dir)) {
      throw new TypeError(`Can't map to ${type} without a dir`)
    }

    // Build the iterator
    const iter = this
      .clone({ type, dir: conv.dir, suffix: conv.suffix })
      .toIterator({
        resources: _.uniq([conv.transformer(this.resource), this.resource]),
        exts: conv.exts
      })

    iter.run({ checkExistence, shortNamespace: false })
    if (iter.lastResults.length === 0 && shortNamespace) {
      return iter.run({ checkExistence, shortNamespace: true })
    } else {
      return iter.lastResults
    }
  }
}

export default RailsPath
