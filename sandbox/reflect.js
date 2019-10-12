class Service {
  constructor(p) {
    this.config = p.config
  }
}

class Provider {
  constructor({ service }) {
    this.service = service
  }
}

const service = new Service({
  name: 'service'
})
const provider = new Provider({ service })

const createReflectedService = function(service) {
  return new Proxy(service, {
    construct(target, props) {
      const _service = Reflect.construct(target, props)
      _service.kek = 'lol'
      return _service
    }
  })
}
const ReflectedService = createReflectedService(Service)
const reflectedService = new ReflectedService({ config: { name: 'reflected' } })
// console.log(reflectedService)
// console.log(reflectedService instanceof Service)

class Core {
  constructor() {
    this.modules = new Map()
  }

  registerModule(module, options) {
    this.modules.set(module, {
      modificator: Core.modificatorMode.class,
      lifetime: Core.lifetimeMode.singleton,

      props: {
        config: Core.modificatorMode.constant
      },

      creator(service) {
        return new Proxy(service, {
          construct(target, props) {
            const _service = Reflect.construct(target, props)
            return _service
          }
        })
      }
    })
  }

  resolveModules() {
    for (const [id, value] of this.modules.entries()) {
      console.log(id)
      console.log(value)
    }
  }

  resolveProps() {
    //
  }
}

Core.modificatorMode = {
  class: Symbol.for('Core.modificatorMode.class'),
  constant: Symbol.for('Core.modificatorMode.constant'),
  function: Symbol.for('Core.modificatorMode.function')
}

Core.lifetimeMode = {
  instance: Symbol.for('Core.lifetimeMode.instance'),
  singleton: Symbol.for('Core.lifetimeMode.singleton')
}

Core.initializeMode = {
  immediately: Symbol.for('Core.initializeMode.immediately'),
  lazy: Symbol.for('Core.initializeMode.lazy')
}

Core.constuctorMode = {
  standart: Symbol.for('Core.constuctorMode.standart'),
  staticMethod: Symbol.for('Core.constuctorMode.classic')
}

Core.registrationMode = {
  standart: Symbol.for('Core.registrationMode.standart'),
  inner: Symbol.for('Core.registrationMode.inner')
}

const core = new Core()
core.registerModule(Service, {
  modificator: Core.modificatorMode.class,
  lifetime: Core.lifetimeMode.singleton,

  props: {
    config: Core.modificatorMode.constant
  }
})

core.registerModule(Provider, {
  modificator: Core.modificatorMode.class,
  lifetime: Core.lifetimeMode.singleton,

  props: {
    services: {
      api: Service
    }
  }
})

core.resolveModules()
