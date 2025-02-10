import { gameTemplate } from "../templates/gameTemplate.js"

export class gameSettingsView extends HTMLElement
{
    constructor()
    {
        super()
    }
    async connectedCallback()
    {
        this.innerHTML = gameTemplate()
    }
}

customElements.define('game-settings-view', gameSettingsView)