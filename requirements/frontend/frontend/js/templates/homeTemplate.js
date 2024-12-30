import { HOME } from '../constants/home.js'
import { escapeHtml } from '../utils/security.js'

export const homeTemplate =
{
    layout()
    {
        return (`
            <div class="table-box""></div>
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
            dynamicPart = `<tr><td colspan="3" id="no-data">no players have played yet !!!</td></tr>`
        db.forEach(e => {
            dynamicPart += 
            `<tr>
                <td>${escapeHtml(e.rank)}</td>
                <td>${escapeHtml(e.username)}</td>
                <td>${escapeHtml(e.totalGames)}</td>
            </tr>
            `
        });

        return `
        <h3>Leaderboard</h3>
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
            ${dynamicPart}
            </tbody`        
    }
}