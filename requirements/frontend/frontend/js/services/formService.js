import { apiService } from './apiService.js'
import { eventHandlers } from '../utils/eventHandlers.js'
// import { sendData, reset} from '../utils/utils.js'
import { FUNCTIONNAME } from '../constants/functionName.js'
import { eventListeners } from '../utils/global.js'

// do i need this service anymore or ?
export const formService =
{
    // async handleSign() 
    // {
    //     return new Promise(resolve => {
    //         const form = document.querySelector('form')

    //         // need to put this function in the eventHandler
    //         eventListeners.on(form, 'submit', async () => 
    //         {
    //             const ENDPOINTS = document.getElementById('signDiv').getAttribute('data-value').toLowerCase().replace(' ', '') 

    //             event.preventDefault()
    //             await sendData(ENDPOINTS)
    //             await reset()
    //             resolve()
    //         })
    //     })
    // },

    handleTournament()
    {
        return new Promise (resolve => {
            const form = document.querySelector('form')
    
            eventListeners.on(form, 'submit', (event) => eventHandlers.form.tournamentFormHandler(event, resolve))
        })
    },
    game()
    {
        return new Promise (resolve => {

            const form = document.querySelector('form')

            eventListeners.on(form, 'submit', (event) => FUNCTIONNAME.GAME_FORM(event, resolve))
        })
    },
    handleAddPassword()
    {
        return new Promise (resolve => {
            const form = document.querySelector('form')
    
            eventListeners.on(form, 'submit', (event) => eventHandlers.form.addPasswordForm(event, resolve))
        })
    }
}