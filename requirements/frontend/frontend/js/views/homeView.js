import { database } from '../constants/database.js'
import { apiService } from '../services/apiService.js'
import { homeTemplate } from '../templates/homeTemplate.js'
import { eventListeners } from '../utils/global.js'
import { databaseExtractorService } from '../services/databaseExtractorService.js'
export class homeView extends HTMLElement
{
    constructor()
    {
        super()
        this.buttons = null /// haha i dont think i will wokr with you anymore  :p
        this._database = null
    }
    async connectedCallback()
    {
        this._database = await apiService.home.getLeaderboardData()
        this._dataTransformer = new databaseExtractorService(this._database)


        this.innerHTML = homeTemplate.layout()
        //for tournament
        const tournament = document.getElementById('tournament')
        tournament.innerHTML = homeTemplate.tournament()
        
        // // the mini boxes
        // const miniBoxes = document.querySelectorAll('.home-mini-box').forEach(e => {
        //     e.innerHTML = homeTemplate.miniBox(e.id)
        // })
        // //this is for the leaderboard
        // this.addLeaderBoard()

        // // setting up the eventlisteners for the moment
        // this.buttons = document.querySelectorAll('.anchor-tmp')
        // eventListeners.setAllByType(this.buttons, 'click')
    }
    disconnectedCallback()
    {
        // eventListeners.removeAllByType(this.buttons, 'click')
    }
    addLeaderBoard()
    {
        const leaderboardDb = this._dataTransformer.extractData('leaderboard')
        const tournament = document.querySelector('.table-box')

        tournament.innerHTML = homeTemplate.leaderboard(leaderboardDb)
        // console.log('normally in here i should add the value of the leaderBoard')
    }
}

customElements.define('home-view', homeView)