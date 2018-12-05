'use babel'
import { root, path, open, dispatch, CAN_NOT_WAIT } from '../spec-helper'

describe('BaseOpener', () => {
  beforeEach(() => {
    // Setup project path for RailsPath
    atom.project.setPaths([root()])
    // To make sure the view of the workspace exists
    atom.views.getView(atom.workspace)

    waitsForPromise(() => atom.packages.activatePackage('rails-transporter-plus'))
  })

  describe('when served as model-opener', () => {
    it('opens model from controller', () => {
      waitsForPromise(() =>
        open('app', 'controllers', 'blogs_controller.rb'))
      runs(() =>
        dispatch('rails-transporter-plus:open-model'))
      waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
        'opening model from controller', CAN_NOT_WAIT)
      runs(() => {
        let editor = atom.workspace.getActiveTextEditor()
        expect(editor.getPath()).toBe(path('app', 'models', 'blog.rb'))
      })
    })

    it('opens model from namespaced controller', () => {
      waitsForPromise(() =>
        open('app', 'controllers', 'admin', 'blogs_controller.rb'))
      runs(() =>
        dispatch('rails-transporter-plus:open-model'))
      waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
        'opening model from namespaced controller', CAN_NOT_WAIT)
      runs(() => {
        let editor = atom.workspace.getActiveTextEditor()
        expect(editor.getPath()).toBe(path('app', 'models', 'blog.rb'))
      })
    })

    it('opens model from view', () => {
      waitsForPromise(() =>
        open('app', 'views', 'blogs', 'index.html.erb'))
      runs(() =>
        dispatch('rails-transporter-plus:open-model'))
      waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
        'opening model from view', CAN_NOT_WAIT)
      runs(() => {
        let editor = atom.workspace.getActiveTextEditor()
        expect(editor.getPath()).toBe(path('app', 'models', 'blog.rb'))
      })
    })

    it('open model from model test', () => {
      waitsForPromise(() =>
        open('test', 'models', 'blog_test.rb'))
      runs(() =>
        dispatch('rails-transporter-plus:open-model'))
      waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
        'opening model from model test', CAN_NOT_WAIT)
      runs(() => {
        let editor = atom.workspace.getActiveTextEditor()
        expect(editor.getPath()).toBe(path('app', 'models', 'blog.rb'))
      })
    })

    it('open model from controller test', () => {
      waitsForPromise(() =>
        open('test', 'controllers', 'blog_controller_test.rb'))
      runs(() =>
        dispatch('rails-transporter-plus:open-model'))
      waitsFor(() => atom.workspace.getActivePane().getItems().length === 2,
        'opening model from model test', CAN_NOT_WAIT)
      runs(() => {
        let editor = atom.workspace.getActiveTextEditor()
        expect(editor.getPath()).toBe(path('app', 'models', 'blog.rb'))
      })
    })
  })
})
