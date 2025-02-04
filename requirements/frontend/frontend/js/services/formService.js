import { eventHandlers } from '../utils/eventHandlers.js'
import { FUNCTIONNAME } from '../constants/functionName.js'
import { eventListeners } from '../managers/globalManager.js'

export class FormService
{
    constructor()
    {
    }
    #eventHandlerTouranmentForm(event, resolve)
    {
        const form = document.querySelector( 'form' )

        event.preventDefault(  )
            
        let data = new FormData( form );
        let playersObject = Object.fromEntries( data )
        let players = Object.values( playersObject )
        resolve( players )
    }
   async handleTournament()
    {
        await new Promise (resolve => {
            const form = document.querySelector('form')
    
            eventListeners.on(form, 'submit', this.#eventHandlerTouranmentForm(event, resolve))
        })
        console.log('im out of form touranemt')
        const modalBackground = document.getElementById('modal-background')
        const players = await formService.handleTournament()
        eventListeners.off(modalBackground, 'click', eventHandlers.removeModalHandler)
        modalBackground.remove()
        resolve(players)
    }
}
