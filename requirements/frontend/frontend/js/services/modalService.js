import { formService } from './formService.js'
import { eventHandlers } from '../utils/eventHandlers.js'
import { modalTemplate } from '../templates/modalTemplate.js'
import { eventListeners } from '../utils/global.js'

export const modalService = 
{
    show(message, type = null)
    {  
        return new Promise(async (resolve) =>  {
            const app = document.getElementById('app')
            const modalHtml = this.createModalHtml(type)
    
            app.insertAdjacentHTML('beforeend', modalHtml)
            const modalBackground = document.getElementById('modal-background')
            const modal = document.getElementById('modal')
    
            modalBackground.style.display = 'flex'
    
            if (type === 'tournament') // what is this - -
            {
                await formService.handleTournament()
            }
            eventListeners.on(modalBackground, 'click', (event ) => eventHandlers.removeModalHandler(event, resolve)) // dont know if we will be needsing this eventlistener
            modal.innerHTML = message
            resolve()
        })
    },

    createModalHtml(type)
    {
        if (type === 'tournament')
            return modalTemplate.tournamentForm()
        else
        {
            return (`
                <div id="modal-background">
                    <div id="modal">
                    </div>
                </div>
                    `)
        }
    },
}