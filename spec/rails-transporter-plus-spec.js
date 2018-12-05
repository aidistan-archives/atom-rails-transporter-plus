'use babel'

describe('RailsTransporterPlus', () => {
  let workspaceElement

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)
    waitsForPromise(() => atom.packages.activatePackage('rails-transporter-plus'))
  })

  describe('when the package is activated', () => {
    it('creates the panel and the list', () => {
      let panel = workspaceElement.querySelector('.rails-transporter-plus')
      expect(panel).toExist()

      let list = panel.querySelector('.select-list')
      expect(list).toExist()
    })

    it('creates the views', () => {
      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement)

      let panel = workspaceElement.querySelector('.rails-transporter-plus')
      expect(panel).not.toBeVisible()

      let list = panel.querySelector('.select-list')
      expect(list).not.toBeVisible()
    })
  })
})
