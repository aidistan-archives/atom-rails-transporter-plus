'use babel'
import _ from 'lodash'
import path from 'path'
import pluralize from 'pluralize'
import BaseOpener from './rails-opener/base'
import ViewOpener from './rails-opener/view'
import RailsPathConvention from './rails-path/convention'

// One place to configure conventions
const conventions = {
  model: {
    config: {
      title: 'Model',
      description: 'Keybinding for opener of models, leave a space to disable',
      type: 'string',
      default: 'ctrl-r m',
      order: 1
    },
    path: {
      dir: path.join('app', 'models'),
      transformer: pluralize.singular
    },
    opener: BaseOpener
  },
  mailer: {
    config: {
      title: 'Mailer',
      description: 'Keybinding for opener of mailers, leave a space to disable',
      type: 'string',
      default: 'ctrl-r ctrl-m',
      order: 2
    },
    path: {
      dir: path.join('app', 'mailers'),
      suffix: '_mailer',
      transformer: pluralize.plural
    },
    opener: BaseOpener
  },
  controller: {
    config: {
      title: 'Controller',
      description: 'Keybinding for opener of controllers, leave a space to disable',
      type: 'string',
      default: 'ctrl-r c',
      order: 3
    },
    path: {
      dir: path.join('app', 'controllers'),
      suffix: '_controller',
      transformer: pluralize.plural
    },
    opener: BaseOpener
  },
  helper: {
    config: {
      title: 'Helper',
      description: 'Keybinding for opener of helpers, leave a space to disable',
      type: 'string',
      default: 'ctrl-r h',
      order: 4
    },
    path: {
      dir: path.join('app', 'helpers'),
      suffix: '_helper',
      transformer: pluralize.plural
    },
    opener: BaseOpener
  },
  view: {
    config: {
      title: 'View',
      description: 'Keybinding for opener of views, layouts and partial templates, leave a space to disable',
      type: 'string',
      default: 'ctrl-r v',
      order: 5
    },
    path: {
      dir: path.join('app', 'views'),
      exts: ['.html.erb', '.html.haml', '.html.slim', '.json.jbuilder'],
      transformer: pluralize.plural,
      adjust: (p) => {
        p.namespace = p.namespace.split(path.sep)

        p.action = path.sep + p.resource
        p.resource = p.namespace.pop()
        p.namespace = p.namespace.join(path.sep)
      }
    },
    opener: ViewOpener
  },
  javascript: {
    config: {
      title: 'Javascript',
      description: 'Keybinding for opener of javascript assets, leave a space to disable',
      type: 'string',
      default: 'ctrl-r j',
      order: 6
    },
    path: {
      dir: path.join('app', 'assets', 'javascripts'),
      exts: ['.js', '.coffee'],
      transformer: pluralize.plural
    },
    opener: BaseOpener
  },
  stylesheet: {
    config: {
      title: 'Stylesheet',
      description: 'Keybinding for opener of stylesheet assets, leave a space to disable',
      type: 'string',
      default: 'ctrl-r s',
      order: 7
    },
    path: {
      dir: path.join('app', 'assets', 'stylesheets'),
      exts: ['.css', '.scss'],
      transformer: pluralize.plural
    },
    opener: BaseOpener
  },
  test: {
    config: {
      title: 'Test',
      description: 'Keybinding for opener of tests, leave a space to disable',
      type: 'string',
      default: 'ctrl-r t',
      order: 8
    },
    path: {
      dir: RegExp(_.escapeRegExp('test' + path.sep) + '(\\w+)'),
      suffix: '_test',
      adjust: (p) => {
        const part = pluralize.singular(p.dir.split(path.sep)[1])
        const partRegExp = RegExp(`_${part}$`)
        if (p.resource.search(partRegExp) !== -1) {
          p.resource = p.resource.replace(partRegExp, '')
          p.suffix = '_' + part + p.suffix
        }
      }
    },
    opener: BaseOpener
  },
  'rspec-spec': {
    config: {
      title: 'Rspec Spec',
      description: 'Keybinding for opener of specs, disabled by default',
      type: 'string',
      default: ' ',
      order: 9
    },
    path: {
      dir: RegExp(_.escapeRegExp('spec' + path.sep) + '(\\w+)'),
      suffix: '_spec',
      adjust: (p) => {
        const part = pluralize.singular(p.dir.split(path.sep)[1])
        const partRegExp = RegExp(`_${part}$`)
        if (p.resource.search(partRegExp) !== -1) {
          p.resource = p.resource.replace(partRegExp, '')
          p.suffix = '_' + part + p.suffix
        }
      }
    },
    opener: BaseOpener
  },
  'rspec-factory': {
    config: {
      title: 'Rspec Factory',
      description: 'Keybinding for opener of factories, disabled by default',
      type: 'string',
      default: ' ',
      order: 10
    },
    path: {
      dir: path.join('spec', 'factories'),
      transformer: pluralize.plural
    },
    opener: BaseOpener
  },
  'pundit-policy': {
    config: {
      title: 'Pundit Policy',
      description: 'Keybinding for opener of policies, disabled by default',
      type: 'string',
      default: ' ',
      order: 11
    },
    path: {
      dir: path.join('app', 'policies'),
      suffix: '_policy',
      transformer: pluralize.singular
    },
    opener: BaseOpener
  }
}

// Populate
for (let type in conventions) {
  conventions[type].path = new RailsPathConvention(conventions[type].path)
  conventions[type].opener = new (conventions[type].opener)(type) // eslint-disable-line
}

export default conventions
