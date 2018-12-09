'use babel'
import { root, path, open, dispatch, CAN_NOT_WAIT } from '../spec-helper'

describe('ViewOpener', () => {
  let workspaceElement

  beforeEach(() => {
    atom.project.setPaths([root()])
    workspaceElement = atom.views.getView(atom.workspace)
    waitsForPromise(() => atom.packages.activatePackage('rails-transporter-plus'))
  })

  it('opens view from controller', () => {
    // Attaching the workspaceElement to the DOM is required to allow the
    // `toBeVisible()` matchers to work. Anything testing visibility or focus
    // requires that the workspaceElement is on the DOM. Tests that attach the
    // workspaceElement to the DOM are generally slower than those off DOM.
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise(() =>
      open('app', 'controllers', 'blogs_controller.rb'))
    runs(() => {
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([7, 0])
      dispatch('rails-transporter-plus:open-view')
    })
    waitsFor(() => {
      const li = workspaceElement.querySelector('.rails-transporter-plus li')
      return li && window.getComputedStyle(li).display !== 'none'
    }, 'opening view from controller', CAN_NOT_WAIT)
    runs(() => {
      const panel = workspaceElement.querySelector('.rails-transporter-plus')
      expect(panel).toBeVisible()
      expect(panel.querySelectorAll('li').length).toBe(2)
    })
  })

  it('opens partial template from view', () => {
    waitsForPromise(() =>
      open('app', 'views', 'blogs', 'edit.html.erb'))
    runs(() => {
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([5, 0])
      dispatch('rails-transporter-plus:open-view')
    })
    waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
      'opening partial template from view', CAN_NOT_WAIT)
    runs(() => {
      const editor = atom.workspace.getActiveTextEditor()
      expect(editor.getPath()).toBe(path('app', 'views', 'shared', '_form.html.erb'))
    })

    waitsForPromise(() =>
      open('app', 'views', 'blogs', 'edit.html.erb'))
    runs(() => {
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([6, 0])
      dispatch('rails-transporter-plus:open-view')
    })
    waitsFor(() => atom.workspace.getActivePane().getItems().length === 3,
      'opening partial template from view', CAN_NOT_WAIT)
    runs(() => {
      const editor = atom.workspace.getActiveTextEditor()
      expect(editor.getPath()).toBe(path('app', 'views', 'blogs', '_form02.html.erb'))
    })
  })
})
