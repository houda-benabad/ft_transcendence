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
       this.innerHTML = settingsTemplate.layout()
       this.querySelector('#settings-box1').innerHTML = settingsTemplate.settingsBox1()
       this.querySelector('#settings-box2').innerHTML = settingsTemplate.settingsBox2()
       this.querySelector('#settings-box3').innerHTML = settingsTemplate.settingsBox3()

    //    eventListeners.setAllByType(document.querySelectorAll('.anchor-tmp'), 'click')
    }
    // to add a disconnected call back, to remove eventlisteners
}

customElements.define('settings-view', settingsView)