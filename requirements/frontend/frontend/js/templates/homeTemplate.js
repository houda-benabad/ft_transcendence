import { HOME } from '../constants/home.js'
import { escapeHtml } from '../utils/security.js'

export const homeTemplate =
{
    layout()
    {
        return (`
            <div class="custom-table""></div>
            <div id="tournament"></div>
            <div id="remote" class="home-mini-box"></div>
            <div id="multiplayer" class="home-mini-box"></div>
            <div id="local" class="home-mini-box"></div>
            `)
    },
    tournament()
    {
        return (
              `
            <div class='cover'>
                <div id="tournament-infos">
                    <div>
                        <h2>join the <span>tournament</span></h2>
                        <p>${HOME.DESCRIPTION.TOURNAMENT_DESCRIPTION}</p>
                    </div>
                    <button class="button-type2 anchor-tmp" data-game-mode='tournament' data-action='play_game'>play</button>
                <div>
            </cover>
            <img src='${HOME.IMG.TOURNAMENT_IMAGE}'>
        `)
    },
    miniBox(id)
    {
        const [h3, p] = HOME.MINIBOXES.get(id)

        return (`
             <div>
                <h3>${h3}</h3>
                <p>${p}</p>
                <button class="button-type2 anchor-tmp" data-game-mode='${id}' data-action='play_game'>play now</button>
            </div>`
        )
    },
    leaderboard(db)
    {
        let dynamicPart = ''

        if (!db.length)
            dynamicPart = `<p id="table-no-results">no players have played yet !!!</p>`
        db.forEach(e => {
            dynamicPart += 
            `<div class="custom-table-row">
                <p>${escapeHtml(e.rank)}</p>
                <p>${escapeHtml(e.username)}</p>
                <p>${escapeHtml(e.totalPoints)}</p>
            </div>
            `
        });

        return `
        <h3>Leaderboard</h3>
        <div id="table">
            <div class="custom-table-head">
                <p>rank</p>
                <p>player</p>
                <p>total points</p>
            </div>
            <div class="custom-table-content">
                ${dynamicPart}    
            </div>
        </div>`          
    }
}