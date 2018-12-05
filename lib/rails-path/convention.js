'use babel'
import _ from 'lodash'

/**
 * Convention for {@link RailsPath}
 */
class RailsPathConvention {
  /**
   * @param {Object}          [convention]
   * @param {(String|RegExp)} [convention.dir='']
   * @param {String}          [convention.suffix='']
   * @param {String|String[]} [convention.exts='.rb']
   * @param {Function}        [convention.transformer=_.identity]
   * @param {Function}        [convention.adjust=_.noop]
   */
  constructor ({
    dir = '', suffix = '', exts = '.rb',
    transformer = _.identity, adjust = _.noop
  } = {}) {
    if (_.isRegExp(dir)) {
      this.dir = ''
      this.dirRegExp = dir
    } else {
      this.dir = dir
      this.dirRegExp = RegExp(_.escapeRegExp(dir))
    }

    this.suffix = suffix

    if (_.isArray(exts)) {
      this.exts = exts
    } else {
      this.exts = [exts]
    }

    this.transformer = transformer
    this.adjust = adjust
  }

  /**
   * @return {RegExp}
   */
  get tailRegExp () {
    return RegExp(`${this.suffix}(${_.map(this.exts, _.escapeRegExp).join('|')})$`)
  }
}

export default RailsPathConvention
