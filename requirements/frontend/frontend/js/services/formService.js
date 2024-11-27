import { apiService } from './apiService.js'
import { eventHandlers } from '../utils/eventHandlers.js'
import { sendData, reset} from '../utils/utils.js'
import { FUNCTIONNAME } from '../constants/functionName.js'

// do i need this service anymore or ?
export const formService =
{
    async handleSign() 
    {
        return new Promise(resolve => {
            const form = document.querySelector('form')

            // need to put this function in the eventHandler
            eventListeners.on(form, 'submit', async () => 
            {
                const ENDPOINTS = document.getElementById('signDiv').getAttribute('data-value').toLowerCase().replace(' ', '') 

                event.preventDefault()
                const response = await sendData(ENDPOINTS)
                if (response === true)
                {
                    await reset()
                    resolve()
                }
            })
        })
    },

    handleTournament()
    {
        return new Promise (resolve => {
            const form = document.querySelector('form')
    
            eventListeners.on(form, 'submit', (event) => eventHandlers.form.tournamentFormHandler(event))
        })
    },
    game()
    {
        return new Promise (resolve => {

            const form = document.querySelector('form')

            eventListeners.on(form, 'submit', (event) => FUNCTIONNAME.GAME_FORM(event, resolve))
        })
    },
}