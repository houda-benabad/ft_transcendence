import {tableLine} from './tools.js'
import {addFriendsBox} from './tools.js'

export class profileView extends HTMLElement
{
    constructor(){
        super()
    }
    connectedCallback() 
    {
        this.addLayout()
        this.adduserInfos()
        this.addGameHistory()
        addFriendsBox()
    }
    addLayout()
    {
        const profileBox1 = document.createElement('div')
        const profileBox2 = document.createElement('div')
        const profileBox3 = document.createElement('div')

        profileBox1.id = 'profile-box1'
        profileBox2.classList.add('table-box')
        profileBox3.classList.add('friends-box')

        this.appendChild(profileBox1)
        this.appendChild(profileBox2)
        this.appendChild(profileBox3)

    }
    async adduserInfos()
    {
        const response = await fetch('./Apis/user.json')
        const responseText = await response.json()
        const user = responseText.user
        const userInfosBox = document.getElementById('profile-box1')
        
        // this is not a clean way to do it but lets just keep going
        userInfosBox.innerHTML =
        `
        <div id="box">
            <div id="profile-box1-top">
                <div id="profile-box1-top1">
                    <img src="${user.image}">
                    <div id="profile-box1-top-id">
                        <h2 id="profile-box1-top-username">${user.username}</h2>
                        <p class="status profile-box1-box-text">${user.status}</p>
                    </div>
                </div>
                <div class="anchor-box square">
                    <a href="./edit-profile"><i class="iconify" data-icon="mage:edit" data-inline="false"></i></a>
                </div>
            </div>
            <div id="profile-box1-middle">
                <p class="profile-box1-box-text">Level</p>
                <div>
                    <div id="level-wrap" class="progress">
                        <div id="level-progress" class="progress"></div>
                    </div>
                    <p class="profile-box1-box-text">${user.levelPercentage}%</p>
                </div>
            </div>
            <div id="profile-box1-bottom">
                <div>
                    <p class="profile-box1-box-text">Level</p>
                    <p class="profile-box1-bottom-data">${user.level}</p>
                </div>
                <div class="vertical-dividers"></div>
                <div>
                    <p class="profile-box1-box-text">totalGames</p>
                    <p class="profile-box1-bottom-data">${user.totalGames}</p>
                </div>
                <div class="vertical-dividers"></div>
                <div>
                    <p class="profile-box1-box-text">friends</p>
                    <p class="profile-box1-bottom-data">${user.friends}</p>
                </div>
                <div class="vertical-dividers"></div>
                <div>
                    <p class="profile-box1-box-text">Rank</p>
                    <p class="profile-box1-bottom-data">${user.rank}</p>
                </div>
            </div>
        </div>
    `
    this.animateProgressBar(user.levelPercentage)
    window.addEventListener('resize', () => this.animateProgressBar())
    }
    animateProgressBar(levelPercentage)
    {
        const startTime = performance.now()
        const levelBar = document.getElementById('level-progress')
        function update(currentTime)
        {
            const elapsedTime = currentTime - startTime
            const duration = (1500 * (levelPercentage / 100))
            const progress = Math.min(elapsedTime / duration, 1) // 2000 represent the duration i want for my animation in ms
            const targetPorcentage = progress * levelPercentage

            levelBar.style.width = `${targetPorcentage}%`
            if (progress < 1)
                requestAnimationFrame(update)

        }
        requestAnimationFrame(update)
    }
    async addGameHistory()
    {
        const gameHistoryBox = document.querySelector('.table-box')    
        
        gameHistoryBox.innerHTML = `
        <h3>Game History</h3>
        <div id="table">
            <table>
                <thead>
                    <tr>
                        <th>game type</th>
                        <th>date/time</th>
                        <th>points</th>
                        <th>status</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        `
        const response = await fetch('../Apis/game.json')
        const responseText = await response.text()

        const tbody = document.querySelector('tbody')
        if (responseText)
        {
            const response = JSON.parse(responseText)
            const game = response.game
            
            for (let i = 0; game[i] ; i++)
                tableLine(game[i])
        }
        else
        {
            const tr = document.createElement('tr')
            const td = document.createElement('td')

            td.innerHTML = 'no game played !!!'
            td.colSpan = 4
            td.classList.add('message-info')
            tr.appendChild(td)
            tbody.appendChild(tr)
        }
    }
}

customElements.define('profile-view', profileView) 