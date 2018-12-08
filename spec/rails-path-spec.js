'use babel'
import RailsPath from '../lib/rails-path'
import { root, path } from './spec-helper'

describe('RailsPath', () => {
  beforeEach(() => {
    // Setup project path for RailsPath
    atom.project.setPaths([root()])
  })

  it('parses controller path', () => {
    const filePath = path('app', 'controllers', 'blogs_controller.rb')
    const railsPath = RailsPath.parse(filePath)

    expect(railsPath.type).toBe('controller')
    expect(railsPath.resource).toBe('blogs')
  })

  it('parses namespace controller path', () => {
    const filePath = path('app', 'controllers', 'admin', 'blogs_controller.rb')
    const railsPath = RailsPath.parse(filePath)

    expect(railsPath.type).toBe('controller')
    expect(railsPath.namespace).toBe(path.sep + 'admin')
    expect(railsPath.resource).toBe('blogs')
  })
})
