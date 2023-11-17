import { enableModule, localize, MODULE_ID } from './module.js'

export function registerSettings() {
    const isGM = game.data.users.find(x => x._id === game.data.userId).role >= CONST.USER_ROLES.GAMEMASTER

    /**
     * GM
     */
    const statuses = ['first', 'second', 'third', 'fourth'].map(x => localize(`settings.status.statuses.${x}`)).join(', ')
    register('status', String, statuses, { scope: 'world' })

    register('last-status', Boolean, false, { scope: 'world' })

    register('party', Boolean, false, { scope: 'world' })

    /**
     * CLIENT
     */
    register('enabled', Boolean, true, { onChange: enableModule })

    register('position', String, 'right', {
        choices: {
            left: path('position', 'choices.left'),
            right: path('position', 'choices.right'),
            top: path('position', 'choices.top'),
            bottom: path('position', 'choices.bottom'),
        },
    })

    register('small-position', String, 'top', {
        choices: {
            left: path('position', 'choices.left'),
            right: path('position', 'choices.right'),
            top: path('position', 'choices.top'),
            bottom: path('position', 'choices.bottom'),
        },
    })

    register('delay', Number, 250, {
        range: {
            min: 0,
            max: 2000,
            step: 50,
        },
    })

    register('scale', Number, 14, {
        range: {
            min: 10,
            max: 30,
            step: 1,
        },
    })

    register('use-holding', String, 'none', {
        hint: path('use-holding', isGM ? 'choices.gm.hint' : 'choices.player.hint'),
        choices: {
            none: path('use-holding', 'choices.none'),
            half: path('use-holding', isGM ? 'choices.gm.half' : 'choices.player.half'),
            all: path('use-holding', isGM ? 'choices.gm.all' : 'choices.player.all'),
        },
    })

    register('autolock', String, 'none', {
        choices: {
            none: path('autolock', 'choices.none'),
            hover: path('autolock', 'choices.hover'),
            render: path('autolock', 'choices.render'),
        },
    })

    register('chat-close', Boolean, false)
    register('attack-close', Boolean, false)
    register('action-close', Boolean, false)
    register('cast-close', Boolean, false)
    register('skill-close', Boolean, false)
    register('macro-close', Boolean, false)

    register('no-dead', Boolean, false)

    register('observer', Boolean, true)

    register('see-status', Boolean, false)

    // tooltip

    register('saves', String, 'bonus', {
        choices: {
            none: path('saves', 'choices.none'),
            bonus: path('saves', 'choices.bonus'),
            dc: path('saves', 'choices.dc'),
        },
    })

    register('others', String, 'none', {
        choices: {
            none: path('saves', 'choices.none'),
            bonus: path('saves', 'choices.bonus'),
            dc: path('saves', 'choices.dc'),
        },
    })

    register('ranks', Boolean, false)

    register('show-death', String, 'always', {
        choices: {
            none: path('show-death', 'choices.none'),
            always: path('show-death', 'choices.always'),
            only: path('show-death', 'choices.only'),
        },
    })

    register('force-speed', Boolean, false)

    register('tooltips', Boolean, false)

    register('pips', Boolean, false)

    // distance

    register('distance', String, 'all', {
        choices: {
            none: path('distance', 'choices.none'),
            self: path('distance', 'choices.self'),
            all: path('distance', 'choices.all'),
        },
    })

    register('unit', String, '')

    // sidebar

    register('height', String, '')

    register('filter', Boolean, false)

    register('scrollbar', Boolean, true)

    register('hazard-width', Number, 32, {
        range: {
            min: 14,
            max: 50,
            step: 1,
        },
    })

    register('actions-columns', Boolean, false)

    register('items-columns', Boolean, false)

    register('spells-columns', Boolean, false)

    register('skills-columns', Boolean, false)

    // actions

    register('actions', String, 'split', {
        choices: {
            name: path('actions', 'choices.name'),
            type: path('actions', 'choices.type'),
            split: path('actions', 'choices.split'),
        },
    })

    register('actions-colors', Boolean, true)

    // items

    register('containers', Boolean, false)

    // spells

    register('spells', Boolean, false)

    register('tradition', Boolean, false)

    // skills

    register('untrained', Boolean, true)
}

export function renderSettingsConfig(_, html) {
    const tab = html.find(`.tab[data-tab=${MODULE_ID}]`)

    function beforeGroup(name, key, dom = 'h3') {
        const localized = localize(`menu.${key}`)
        tab.find(`[name="${MODULE_ID}.${name}"]`).closest('.form-group').before(`<${dom}>${localized}</${dom}>`)
    }

    if (game.user.isGM) {
        beforeGroup('enabled', 'client.header', 'h2')
    }

    beforeGroup('saves', 'client.tooltip')
    beforeGroup('distance', 'client.distance')
    beforeGroup('height', 'client.sidebar')
    beforeGroup('actions', 'client.actions')
    beforeGroup('containers', 'client.items')
    beforeGroup('spells', 'client.spells')
    beforeGroup('untrained', 'client.skills')
}

function path(setting, key) {
    return `${MODULE_ID}.settings.${setting}.${key}`
}

function register(name, type, defValue, extra = {}) {
    game.settings.register(MODULE_ID, name, {
        name: path(name, 'name'),
        hint: path(name, 'hint'),
        scope: 'client',
        config: true,
        type,
        default: defValue,
        ...extra,
    })
}
