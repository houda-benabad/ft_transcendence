import router from "../router/router.js"
import { formService } from "../services/formService.js"
import { modalService } from "../services/modalService.js"
import Local from "./localManagers.js"
import { reset } from "../utils/utils.js"
import { local } from "../mods/local.js"

export class gameManager 
{
    constructor()
    {
        this.gameSettings = null
        this.app = document.getElementById( 'app' )
    }

    #run(classInstance)
    {
        this.app.replaceChildren()

        classInstance.setup( )
        return new Promise ( ( resolve )=>{
            classInstance.animate( resolve )
        })
    }
    async #init( ){
        await router.navigateTo( '/game-settings' )
        this.gameSettings = await formService.game(  )
        router.navigateTo( './game' )
    }
    async #denit( ){
        await modalService.show(  'Game over', 'hihi' )
        await reset(  )
        router.navigateTo( '/home' )
    }
    async local()
    {
        this.#init( )
        await local( this.gameSettings , ["player1", "player2"])
        this.#denit()
    }
    async tournament( ){
        const players = await modalService.show(  '', 'tournament' ) // the alias names for the players 
        this.#init( )
        const winners = []
        winners[0] = await local(  this.gameSettings, [players[0], players[1]]  )
        winners[1] = await local(  this.gameSettings , [players[2], players[3]] )
        const winner = await local(  this.gameSettings , winners )
        this.#denit( )
    }
}