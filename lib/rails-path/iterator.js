'use babel'
import 'lodash.product'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'

/**
 * Iterator for {@link RailsPath}
 */
class RailsPathIterator {
  /**
   * @param {RailsPath} base
   * @param {Object}    [space]
   * @param {String[]}  [space.dirs]
   * @param {String[]}  [space.namespaces]
   * @param {String[]}  [space.resources]
   * @param {String[]}  [space.actions]
   * @param {String[]}  [space.suffixes]
   * @param {String[]}  [space.exts]
   */
  constructor (base, { dirs, namespaces, resources, actions, suffixes, exts } = {}) {
    this.base = base
    this.dirs = dirs || [base.dir]
    this.namespaces = namespaces || [base.namespace]
    this.resources = resources || [base.resource]
    this.actions = actions || [base.action]
    this.suffixes = suffixes || [base.suffix]
    this.exts = exts || [base.ext]
  }

  /**
   * @param {Object}  [options]
   * @param {Boolean} [options.checkExistence=true] whether to check existence
   * @param {Boolean} [options.shortNamespace=true] whether to traverse namespaces
   * @return {RailsPath[]}
   */
  run ({ checkExistence = true, shortNamespace = true } = {}) {
    if (shortNamespace) {
      this.namespaces = _(this.namespaces)
        .map((ns) => {
          const segs = ns.split(path.sep)
          return _.rangeRight(1, segs.length + 1).map((n) => _.take(segs, n).join(path.sep))
        })
        .flattenDeep().value()
    }

    let paths = _.product(
      this.dirs, this.namespaces, this.resources, this.actions, this.suffixes, this.exts
    ).map(([dir, namespace, resource, action, suffix, ext]) =>
      this.base.clone({ dir, namespace, resource, action, suffix, ext }))

    paths = _.uniqBy(paths, (p) => p.path)
    if (checkExistence) paths = _.filter(paths, (p) => fs.existsSync(p.path))

    return (this.lastResults = paths)
  }
}

export default RailsPathIterator
