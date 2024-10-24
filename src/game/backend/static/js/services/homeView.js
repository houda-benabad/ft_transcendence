import {tableLine, showModal} from './tools.js'
import router from './router.js'
import {start} from '../game.js'
import {local} from '../local.js'
import {tourn} from '../tournament.js'
import {multi} from '../multiPlayer.js'
export class homeView extends HTMLElement
{
    constructor()
    {
        super()
    }
    connectedCallback()
    {
        this.addLayout()
        this.addLeaderBoard()
        this.addTournament()
        this.addMiniBoxes()
    }
    addLayout()
    {
        const leaderBoard = document.createElement('div')
        const tournament = document.createElement('div')
        const remote = document.createElement('div')
        const multiplayer = document.createElement('div')
        const local = document.createElement('div')

        leaderBoard.classList.add('table-box')
        tournament.id = 'tournament'
        remote.id = "remote"
        multiplayer.id = "multiplayer"
        local.id = "local"
        local.classList.add('home-mini-box')
        multiplayer.classList.add('home-mini-box')
        remote.classList.add('home-mini-box')


        this.appendChild(leaderBoard)
        this.appendChild(tournament)
        this.appendChild(remote)
        this.appendChild(multiplayer)
        this.appendChild(local)
    }
    async addLeaderBoard()
    {
       const leaderBoard = document.querySelector('.table-box')

       leaderBoard.innerHTML = `
       <h3>Top Players</h3>
       <div id="table">
           <table>
               <thead>
                   <tr>
                       <th>rank</th>
                       <th>player</th>
                       <th>total games</th>
                   </tr>
               </thead>
               <tbody>
               </tbody>
           </table>
       </div>
       `
       const response = await fetch('../Apis/leaderboard.json')
       const responseText = await response.text()

       const tbody = document.querySelector('tbody')
       if (responseText)
       {
           const response = JSON.parse(responseText)
           const leaderBoard = response.leaderboard
           
           for (let i = 0; leaderBoard[i] ; i++)
               tableLine(leaderBoard[i])
       }
       else
       {
           const tr = document.createElement('tr')
           const td = document.createElement('td')

           td.innerHTML = 'no one had played yet!!!'
           td.colSpan = 3
           td.classList.add('message-info')
           tr.appendChild(td)
           tbody.appendChild(tr)
       }
    }
    addTournament()
    {
        const tournament = document.getElementById('tournament')
        const imgUrl = 'static/img/homeHighlighter.png'
        tournament.innerHTML = 
        `
            <div class='cover'>
                <div id="tournament-infos">
                    <div>
                        <h2>join the <span>tournament</span></h2>
                        <p>jks sks sksjskjsk sksjs sjsowwkw dwidwdwd dkkd dkdnkdd dkdjkd
                        ldkldkldkldkdlkdld dkdlddkldm ldd  dddldkld dld </p>
                    </div>
                    <button class="button-type2 anchor-tmp" data-link='tournament'>play</button>
                <div>
            </cover>
            <img src='${imgUrl}'>
        `
    }
    addMiniBoxes()
    {
        const miniBoxes = document.querySelectorAll('.home-mini-box').forEach(e => {
            const id = e.id
            const info ={
                h3 : null,
                p : null,
            }
            switch(id)
            {
                case 'remote' :
                info.h3 = 'Remote'
                info.p = 'hihihihi i was joking with u ^^'
                break;
                case 'multiplayer' :
                info.h3 = 'Multiplayer'
                info.p = 'do you want to fight, yalah lets go'
                break;
                case 'local' :
                info.h3 = 'Local'
                info.p = 'zdambooooooorbaaaah , lala yalh n3awduu'
                break;
            }
            console.log(id)
            e.innerHTML =
            `
            <div>
                <h3>${info.h3}</h3>
                <p>${info.p}</p>
                <button class="button-type2 anchor-tmp" data-link='${id}'>play now</button>
            </div>
            `
        })
        // here we gonna be adding the event listener that should be  removed later on

        document.querySelectorAll('.anchor-tmp').forEach(a => a.addEventListener('click' , () =>{
            //  MAIN CONTENT NEED TO BE EMPTY
            switch (a.dataset.link) {
                case 'remote':
                    start()
                    break;

                case 'local':
                    local()
                    break;

                case 'tournament':
                    tourn()
                    break;
                
                case 'multiplayer':
                    multi()
                    break;
            
                default:
                    break;
            }
        }))
    }
}

customElements.define('home-view', homeView)