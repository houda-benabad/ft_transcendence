import { eventListeners } from '../managers/globalManager.js'
import { removeModalHandler } from '../utils/utils.js'
export class FormService
{
    constructor()
    {
    }
    #removeModal()
    {
        const modalBackground = document.getElementById('modal-background')

        modalBackground.remove()
        eventListeners.off(modalBackground, 'click', removeModalHandler) // leak
    }
    #eventHandlerTournamentForm(event, resolve)
    {
        const form = document.querySelector( 'form' )
        
        event.preventDefault()
        this.#removeModal()
            
        let data = new FormData( form );
        let playersObject = Object.fromEntries( data )
        let players = Object.values( playersObject )
        resolve( players )
    }
    #eventHandlerGameForm( event, resolve )
    {
        const form = document.querySelector( 'form' )
        
        event.preventDefault()
        
    
        let data = new FormData( form );
        let gameSettings = Object.fromEntries( data )
        resolve( gameSettings )
    }
    #eventHandlerPasswordForm (event, resolve)
    {
        const form = document.querySelector( 'form' )

        event.preventDefault(  )
        this.#removeModal()

        let data = new FormData( form );
        let gameSettings = Object.fromEntries( data )
        resolve( gameSettings )
    }
    handleTournament()
    {
        return new Promise (resolve => {
            const form = document.querySelector('form')
            
            eventListeners.on(form, 'submit', (event) => this.#eventHandlerTournamentForm(event, resolve)) // remove this one
        })
    }
    handleGame()
    {
        return new Promise (resolve => {

            const form = document.querySelector('form')

            eventListeners.on(form, 'submit', (event) => this.#eventHandlerGameForm(event, resolve)) // remove leak
        })
    }
    handlePassword()
    {
        return new Promise (resolve => {

            const form = document.querySelector('form')

            eventListeners.on(form, 'submit', (event) => this.#eventHandlerPasswordForm(event, resolve)) // remove leak
        })
    }
}
