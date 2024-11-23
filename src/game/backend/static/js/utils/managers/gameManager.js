import router from "../../router/router.js"
import { formService } from "../../services/formService.js"
import { modalService } from "../../services/modalService.js"
import Local from "./localManagers.js"
import { reset } from "../utils.js"

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

    // async local()
    // {
    //     await router.navigateTo('./game-settings')
    //     this.gameSettings = await formService.game()
        
    //     await this.#run(new Local(this.gameSettings))

    //     await modalService.show('game over', 'hihihi')
    //     //generic state
    //     await reset()
    //     router.navigateTo('./home')
    // }
    async local()
        {
            // game settings
            await router.navigateTo('./game-settings')
            const gameSettings = await formService.game()

            router.navigateTo('./game')

            const game = await local(gameSettings)

            await modalService.show( 'Game over', 'hihi')

            game.clean()
            await reset()
            router.navigateTo('./home')


        }
}