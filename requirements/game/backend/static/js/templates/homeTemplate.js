import { HOME } from '../constants/home.js'

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
                    <button class="button-type2 anchor-tmp" data-mode='tournament' data-action='play_game'>play</button>
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
                <button class="button-type2 anchor-tmp" data-mode='${id}' data-action='play_game'>play now</button>
            </div>`
        )
    }
}