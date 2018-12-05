'use babel'
import RailsPath from '../lib/rails-path'
import { root, path } from './spec-helper'

describe('RailsPath', () => {
  beforeEach(() => {
    // Setup project path for RailsPath
    atom.project.setPaths([root()])
  })

  it('parses rails paths', () => {
    let filePath = path('app', 'controllers', 'blogs_controller.rb')
    let railsPath = RailsPath.parse(filePath)

    expect(railsPath.type).toBe('controller')
    expect(railsPath.resource).toBe('blogs')
  })
})
