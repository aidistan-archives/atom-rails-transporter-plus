'use babel'
import _ from 'lodash'
import { CompositeDisposable } from 'atom'
import SelectList from 'atom-select-list'
import conventions from './rails-conventions'

export default {
  config: _(conventions).map((v, k) => [k, v.config]).fromPairs().value(),
  disposables: new CompositeDisposable(),

  activate () {
    // Setup views first
    this.list = new SelectList({
      items: [],
      elementForItem: (item) => {
        // TODO: to improve the UI later
        const li = document.createElement('li')
        li.textContent = item.relative
        return li
      },
      didCancelSelection: () => this.panel.hide(),
      didConfirmEmptySelection: () => this.panel.hide(),
      didConfirmSelection: (item) => {
        atom.workspace.open(item.absolute)
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
      conventions[type].opener.onMultipleFound = (files) => {
        const items = _.map(files, (file) => {
          return { absolute: file, relative: atom.project.relativize(file) }
        })
        this.panel.show()
        this.list.update({ items })
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
  }
}
