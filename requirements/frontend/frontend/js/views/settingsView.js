// this would be cleaned out, when i ll see what hinds need from here

import { settingsTemplate } from "../templates/settingsTemplate.js"

export class settingsView extends HTMLElement
{
    constructor()
    {
        super()
        
        this._database = null
    }
    set database(value)
    {
        this._database = value
    }
    connectedCallback()
    {
        const db = this._database.extractData('settings')
        this.innerHTML = settingsTemplate.settings(db)

        if (db.is_oauth2 === false)
        {   
            const settings = document.getElementById('settings')
            settings.innerHTML += settingsTemplate.settingsNoIntraFeatures(db)
        }
    }
}

customElements.define('settings-view', settingsView)