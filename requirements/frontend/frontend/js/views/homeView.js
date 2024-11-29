import { homeTemplate } from '../templates/homeTemplate.js'
import { eventListeners } from '../utils/global.js'

export class homeView extends HTMLElement
{
    constructor()
    {
        super()
        this.buttons = null
    }
    connectedCallback()
    {
        this.innerHTML = homeTemplate.layout()
        
        //for tournament
        const tournament = document.getElementById('tournament')
        tournament.innerHTML = homeTemplate.tournament()
        
        // the mini boxes
        const miniBoxes = document.querySelectorAll('.home-mini-box').forEach(e => {
            e.innerHTML = homeTemplate.miniBox(e.id)
        })
        //this is for the leaderboard
        this.addLeaderBoard()

        //setting up the eventlisteners
        this.buttons = document.querySelectorAll('.anchor-tmp')
        eventListeners.setAllByType(this.buttons, 'click')
    }
    disconnectedCallback()
    {
        eventListeners.removeAllByType(this.buttons, 'click')
    }
    addLeaderBoard()
    {
        // console.log('normally in here i should add the value of the leaderBoard')
    }
}

customElements.define('home-view', homeView)