import { getisAllOptionsForGameSettings } from "../managers/globalManager.js"
import { gameSettingsTemplate } from "../templates/gameTemplate.js"

export class gameSettingsView extends HTMLElement
{
    constructor()
    {
        super()
        this._allOptions = getisAllOptionsForGameSettings()
    }
    async connectedCallback()
    {
        this.innerHTML = gameSettingsTemplate.gameSettings()

        const form = document.getElementById('game-settings')

        if (this._allOptions === true)
            form.innerHTML += gameSettingsTemplate.addModes()
        form.innerHTML += gameSettingsTemplate.addBackgroundTexture()
    }
}

customElements.define('game-settings-view', gameSettingsView)