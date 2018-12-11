'use babel'
import _ from 'lodash'
import { CompositeDisposable } from 'atom'
import PackDeps from 'atom-package-deps'
import SelectList from 'atom-select-list'
import conventions from './rails-conventions'

export default {
  config: _(conventions).map((v, k) => [k, v.config]).fromPairs().value(),
  disposables: new CompositeDisposable(),

  activate () {
    // Require deps
    PackDeps('rails-transporter-plus')

    // Setup views first
    this.list = new SelectList({
      items: [],
      elementForItem: (path) => {
        const li = document.createElement('li')

        const primaryLine = document.createElement('div')
        primaryLine.classList.add('primary-line')
        primaryLine.textContent = path.$.base
        li.appendChild(primaryLine)

        const secondaryLine = document.createElement('div')
        secondaryLine.classList.add('secondary-line')
        secondaryLine.textContent = path.relative
        li.appendChild(secondaryLine)

        if (this.addIconToElement) {
          primaryLine.classList.add('icon')
          this.addIconToElement(primaryLine, path.relative)
        }

        return li
      },
      didCancelSelection: () => this.panel.hide(),
      didConfirmEmptySelection: () => this.panel.hide(),
      didConfirmSelection: (path) => {
        atom.workspace.open(path.absolute)
        this.panel.hide()
      }
    })
    this.panel = atom.workspace.addModalPanel({ item: this.list, visible: false })
    this.panel.element.classList.add('rails-transporter-plus')

    // Setup openers later
    const config = atom.config.get('rails-transporter-plus')
    for (let type in conventions) {
      conventions[type].opener.bind(config[type])
      this.disposables.add(
        atom.config.observe(`rails-transporter-plus.${type}`, (newKey) =>
          conventions[type].opener.bind(newKey)))

      // Overwrite default actions
      conventions[type].opener.onMultipleFound = (paths) => {
        this.panel.show()
        this.list.update({ items: paths })
        this.list.focus()
      }
    }
  },

  deactivate () {
    // Dispose first
    this.disposables.dispose()
    this.disposables.clear()

    // Destroy views later
    if (this.list) this.list.destroy()
    if (this.panel) this.panel.destroy()

    // Deactivate openers last
    for (let type in conventions) {
      conventions[type].opener.deactivate()
      conventions[type].opener.onNoneFound = null
      conventions[type].opener.onSingleFound = null
      conventions[type].opener.onMultipleFound = null
    }
  },

  consumeElementIcons (func) {
    this.addIconToElement = func
  }
}
