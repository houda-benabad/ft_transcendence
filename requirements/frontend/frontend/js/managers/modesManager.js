import { globalManager, setisAllOptionsForGameSettings, getIsItOutOfGame, setIsItOutOfGame, getclickedCancelBtn, setclickedCancelBtn} from "./globalManager.js"
import { modalService } from "../services/modalService.js"
import { reset } from "../utils/utils.js"
import { local } from "../mods/local.js"
import { remote } from "../mods/remote.js"
import{ multiplayer} from "../mods/multiplayer.js"
import { tournament } from "../mods/tournament.js"
import { KEYBOARD, MODE, MOUSE, SCORE } from "../constants/engine.js"

const GameManager = {
    gameSettings : null,

    async init( mode ){
        if (mode == MODE.LOCAL || mode == MODE.TOURNAMENT) setisAllOptionsForGameSettings(true)
        else setisAllOptionsForGameSettings(false)
        await globalManager._router.navigateTo( '/game-settings', true)
        this.gameSettings = await globalManager._formService.handleGame(  )
        await globalManager._router.navigateTo( '/game', true)
        await modalService.show( this.get_manual( mode ), false);
    },
    get_manual( mode ){
        let manual = ``
        if (mode == MODE.LOCAL || mode == MODE.TOURNAMENT)
            manual = `
                <div class='manual'>
                    <div class='controls'>
                        <div>
                            Left side keys : <img height=50px src=${KEYBOARD.W}>  <img height=50px src=${KEYBOARD.S}>
                        </div> 
                        <div>
                            Right side keys: <img height=50px src=${KEYBOARD.UP}>  <img height=50px src=${KEYBOARD.DOWN}>
                        </div>
                    </div>
                `
        else
            manual = `
                <div class='manual'>
                    <div class='controls'>
                        <div>
                            Controls : <img height=50px src=${KEYBOARD.UP}>  <img height=50px src=${KEYBOARD.DOWN}>
                        </div> 
                        <div>
                            Win score: <img height=50px src=${SCORE}> 
                        </div>
                    </div>
                `
        manual += ` 
                <div class='mouse_instructions'>
                    <div>
                        Rotation: <img height=50px src=${MOUSE.LEFT}>
                    </div>
                    <div>
                        Translation: <img height=50px src=${MOUSE.RIGHT}>
                    </div>
                    <div>
                        Zoom: <img height=50px src=${MOUSE.SCROL}>
                    </div>
                </div>
            </div>`
        return manual

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