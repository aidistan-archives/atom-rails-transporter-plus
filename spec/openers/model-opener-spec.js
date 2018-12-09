'use babel'
import { root, path, open, dispatch, CAN_NOT_WAIT } from '../spec-helper'

describe('ModelOpener', () => {
  beforeEach(() => {
    atom.project.setPaths([root()])
    atom.views.getView(atom.workspace)
    waitsForPromise(() => atom.packages.activatePackage('rails-transporter-plus'))
  })

  it('opens model concerns from model', () => {
    waitsForPromise(() =>
      open('app', 'models', 'blog.rb'))
    runs(() => {
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([1, 0])
      dispatch('rails-transporter-plus:open-model')
    })
    waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
      'opening model from controller', CAN_NOT_WAIT)
    runs(() => {
      const editor = atom.workspace.getActiveTextEditor()
      expect(editor.getPath()).toBe(path('app', 'models', 'concerns', 'searchable.rb'))
    })
  })

  it('opens controller concerns from controller', () => {
    waitsForPromise(() =>
      open('app', 'controllers', 'blogs_controller.rb'))
    runs(() => {
      atom.workspace.getActiveTextEditor().setCursorBufferPosition([3, 0])
      dispatch('rails-transporter-plus:open-model')
    })
    waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
      'opening model from controller', CAN_NOT_WAIT)
    runs(() => {
      const editor = atom.workspace.getActiveTextEditor()
      expect(editor.getPath()).toBe(path('app', 'controllers', 'concerns', 'blog', 'taggable.rb'))
    })
  })
})
