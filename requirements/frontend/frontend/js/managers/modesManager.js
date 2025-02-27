import { globalManager, setisAllOptionsForGameSettings, getIsItOutOfGame, setIsItOutOfGame, getclickedCancelBtn, setclickedCancelBtn} from "./globalManager.js"
import { modalService } from "../services/modalService.js"
import { reset } from "../utils/utils.js"
import { local } from "../mods/local.js"
import { remote } from "../mods/remote.js"
import{ multiplayer} from "../mods/multiplayer.js"
import { tournament } from "../mods/tournament.js"
import { MODE } from "../constants/engine.js"

const GameManager = {
    gameSettings : null,

    async init( mode ){
        if (mode == MODE.LOCAL || mode == MODE.TOURNAMENT) setisAllOptionsForGameSettings(true)
        else setisAllOptionsForGameSettings(false)
        await globalManager._router.navigateTo( '/game-settings', true)
        this.gameSettings = await globalManager._formService.handleGame(  )
        await globalManager._router.navigateTo( '/game', true)
        if (mode == MODE.LOCAL || mode == MODE.TOURNAMENT)
            await modalService.show("🎮 Controls:<br>🟦 Left side keys : W / S<br>🟥 Right side keys: ⬆ / ⬇", false);
        else
            await modalService.show("🎮 Controls:<br>🟦  keys: ⬆ / ⬇ <br> Score 10 to win", false);

    },
    async denit( message='game over' ){
        if (getIsItOutOfGame() === false  || getclickedCancelBtn( ) == true){
            if ( getclickedCancelBtn( ) == false )
                await modalService.show( message, false)
            setclickedCancelBtn( false )
            await reset(  )
            globalManager._router.navigateTo( '/' )
        }
        
    },
    async tournament_form( ){
        await modalService.show(  '', false,'tournament' )
        const players = await globalManager._formService.handleTournament()
        return players
    },
    async local()
    {
        await this.init( MODE.LOCAL )
        let result = await local( this.gameSettings , ["Player1", "Player2"])
        await this.denit( `${result} won` )
    },
    async tournament( ){
        const players = await this.tournament_form( )
        await this.init( MODE.TOURNAMENT )
        await tournament(this.gameSettings, players  )
        await this.denit(  )
    },
    async remote( ){
        await this.init( MODE.REMOTE )
        let result = await remote( this.gameSettings )
        result ? await this.denit( `${result.state}` ) : await this.denit(  )
    },
    async multiplayer( ){
        await this.init( MODE.MULTIPLAYER )
        let result = await multiplayer( )
        result ? await this.denit( `${result.state}` ) : await this.denit(  )

    }
}

export default GameManager