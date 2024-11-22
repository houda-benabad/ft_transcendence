import { formService } from "../services/formService.js"
import { gameTemplate } from "../templates/gameTemplate.js"
import { eventHandlers } from "../utils/eventHandlers.js"

import { TEXTURE } from "../constants/components.js"
import Local from "../utils/managers/localManagers.js"
import { modalService } from "../services/modalService.js"
import { reset } from "../utils/utils.js"
import router from "../router/router.js"

export class gameView extends HTMLElement
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
        const gameOptions = await formService.game()
        router.go('./game/local')
        // await this.runGame(gameOptions)
        // await modalService.show( 'Game over', 'hihi')
        // this.game.clean()
        // await reset()
    }
    async runGame(gameOptions)
    {

        const app = document.getElementById( 'app' )
            // removed event listeners, and cleand app
            eventListeners.removeAll()
            app.replaceChildren()

            // cre
            this.game = new Local( gameOptions )
            this.game.setup( )
            return new Promise ( ( resolve )=>{
                this.game.animate( resolve )

            })
    }
    disconnectedCallback()
    {
        // do i need to remove all of this event listeners, im gonna reset  - -
        eventListeners.removeAllByType(this.modes, 'change')
        eventListeners.off(this.input, 'input')
    }
}

customElements.define('game-view', gameView)