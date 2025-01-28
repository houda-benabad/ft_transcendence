// this would be cleaned out, when i ll see what hinds need from here

import { settingsTemplate } from "../templates/settingsTemplate.js"

export class settingsView extends HTMLElement
{
    constructor()
    {
        super()
    }
    connectedCallback()
    {
       this.innerHTML = settingsTemplate.settings()
    }
}

customElements.define('settings-view', settingsView)