// import { formService } from "../services/formService.js"
import { gameTemplate } from "../templates/gameTemplate.js"
import { eventHandlers } from "../utils/eventHandlers.js"

import { TEXTURE } from "../constants/components.js"
import Local from "../managers/localManagers.js"
import { modalService } from "../services/modalService.js"
import { reset } from "../utils/utils.js"
// import router from "../router/router.js"
import { eventListeners } from "../utils/global.js"

export class gameSettingsView extends HTMLElement
{
    constructor()
    {
        super()

        this.input = null
        this.modes = null
        this.game = null
    }
    async connectedCallback()
    {
        this.innerHTML = gameTemplate()

        // SETTING THE EVENT LISTENERS
        this.input = document.getElementById('slider-input')
        this.modes = document.querySelectorAll('input[name="mode"]')

        eventListeners.setAllByType(this.modes, 'change')
        eventListeners.on(this.input, 'input', (event) => eventHandlers.game.inputOfSlider())   
    }
    disconnectedCallback()
    {
        // do i need to remove all of this event listeners, im gonna reset  - -
        eventListeners.removeAllByType(this.modes, 'change')
        eventListeners.off(this.input, 'input')
    }
}

customElements.define('game-settings-view', gameSettingsView)