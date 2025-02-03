import { databaseExtractorService } from '../services/databaseExtractorService.js'
import { homeTemplate } from '../templates/homeTemplate.js'
import { eventListeners } from '../managers/globalManager.js'

export class homeView extends HTMLElement
{
    constructor()
    {
        super()
        this.buttons = null /// haha i dont think i will wokr with you anymore  :p
        this._database = null
    }
    set database(value)
    {
        this._database = value
    }
    async connectedCallback()
    {
        this.innerHTML = homeTemplate.layout()
        //for tournament
        const tournament = document.getElementById('tournament')
        tournament.innerHTML = homeTemplate.tournament()
        
        // // the mini boxes
        const miniBoxes = document.querySelectorAll('.home-mini-box').forEach(e => {
            e.innerHTML = homeTemplate.miniBox(e.id)
        })
        // //this is for the leaderboard
        this.addLeaderBoard()

        // setting up the eventlisteners for the moment
        this.buttons = document.querySelectorAll('.anchor-tmp')
        eventListeners.setAllByType(this.buttons, 'click')
    }
    disconnectedCallback()
    {
        // eventListeners.removeAllByType(this.buttons, 'click')
    }
    addLeaderBoard()
    {
        const leaderboardDb = this._database.extractData('leaderboard')
        const tournament = document.querySelector('.custom-table')

        tournament.innerHTML = homeTemplate.leaderboard(leaderboardDb)
        // console.log('normally in here i should add the value of the leaderBoard')
    }
}

customElements.define('home-view', homeView)