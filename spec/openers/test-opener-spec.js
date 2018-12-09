'use babel'
import { root, path, open, dispatch, CAN_NOT_WAIT } from '../spec-helper'

describe('TestOpener', () => {
  beforeEach(() => {
    atom.project.setPaths([root()])
    atom.views.getView(atom.workspace)
    waitsForPromise(() => atom.packages.activatePackage('rails-transporter-plus'))
  })

  it('opens model test from model', () => {
    waitsForPromise(() =>
      open('app', 'models', 'blog.rb'))
    runs(() =>
      dispatch('rails-transporter-plus:open-test'))
    waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
      'opening model test from model', CAN_NOT_WAIT)
    runs(() => {
      const editor = atom.workspace.getActiveTextEditor()
      expect(editor.getPath()).toBe(path('test', 'models', 'blog_test.rb'))
    })
  })

  it('opens controller test from controller', () => {
    waitsForPromise(() =>
      open('app', 'controllers', 'blogs_controller.rb'))
    runs(() =>
      dispatch('rails-transporter-plus:open-test'))
    waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
      'opening controller test from controller', CAN_NOT_WAIT)
    runs(() => {
      const editor = atom.workspace.getActiveTextEditor()
      expect(editor.getPath()).toBe(path('test', 'controllers', 'blogs_controller_test.rb'))
    })
  })
})
