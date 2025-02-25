import { homeTemplate } from '../templates/homeTemplate.js'

export class homeView extends HTMLElement
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
    async connectedCallback()
    {
        this.innerHTML = homeTemplate.layout()

        const tournament = document.getElementById('tournament')
        tournament.innerHTML = homeTemplate.tournament()

        const miniBoxes = document.querySelectorAll('.home-mini-box').forEach(e => {
            e.innerHTML = homeTemplate.miniBox(e.id)
        })

        this.addLeaderBoard()

        const main = document.getElementById('main')
        main.style.overflow = 'visible'
    }
    disconnectedCallback()
    {
        const main = document.getElementById('main')
        main.style.overflow = 'hidden' 
    }
    addLeaderBoard()
    {
        let leaderboardDb = this._database.extractData('leaderboard')
        const tournament = document.querySelector('.custom-table')

        tournament.innerHTML = homeTemplate.leaderboard(leaderboardDb)
    }
}

customElements.define('home-view', homeView)