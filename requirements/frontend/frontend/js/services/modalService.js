// import { formService } from './formService.js'
import { eventHandlers } from '../utils/eventHandlers.js'
import { modalTemplate } from '../templates/modalTemplate.js'
import { eventListeners } from '../managers/globalManager.js'

export const modalService = 
{
    show(message, automatised =  false , type = null)
    {  
        console.log('in here  : ', message)
        return new Promise(async (resolve) =>  {
            const app = document.getElementById('app')
            const modalHtml = this.createModalHtml(type, message)
    
            // console.log('modal : ', modalHtml)
            app.insertAdjacentHTML('beforeend', modalHtml)
            const modalBackground = document.getElementById('modal-background')
            const modal = document.getElementById('modal')
    
            modalBackground.style.display = 'flex'

            if (!automatised)
                eventListeners.on(modalBackground, 'click', (event ) => eventHandlers.removeModalHandler(event, resolve)) // dont know if we will be needsing this eventlistener
            else
            {
                await new Promise ((resolve) => setTimeout(resolve, 1000))
                eventHandlers.removeModalHandler(null, resolve)
            }
            
            if (type === 'add-password')
            {
                const response = await formService.handleAddPassword()
                eventListeners.off(modalBackground, 'click', eventHandlers.removeModalHandler)
                modalBackground.remove()
                resolve(response)
            }
            else if (type === 'tournament')
            {

                const players = await formService.handleTournament()
                eventListeners.off(modalBackground, 'click', eventHandlers.removeModalHandler)
                modalBackground.remove()
                resolve(players)
            }
        })
    },

    createModalHtml(type, message)
    {
        // console.log('type : ', type)
        if (type === 'tournament')
            return modalTemplate.tournamentForm()
        else if (type === 'add-password')
            return modalTemplate.addPasswordForm()
        else
        {
            return (`
                <div id="modal-background">
                    <div id="modal">
                        ${message}
                    </div>
                </div>
                    `)
        }
    },
}