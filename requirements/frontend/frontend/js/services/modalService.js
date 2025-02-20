import { modalTemplate } from '../templates/modalTemplate.js'
import { eventListeners } from '../managers/globalManager.js'
import { removeModalHandler } from '../utils/utils.js'

export const modalService = 
{
    show(message, automatised =  false , type = null)
    {  
        return new Promise(async (resolve) =>  {
            const app = document.getElementById('app')
            const modalHtml = this.createModalHtml(type, message)
    
            // console.log(" modal htmp = ",modalHtml )
            app.insertAdjacentHTML('beforeend', modalHtml)
            const modalBackground = document.getElementById('modal-background')
            const modal = document.getElementById('modal')
    
            modalBackground.style.display = 'flex'

            if (!automatised)
                eventListeners.on(modalBackground, 'click', (event ) => removeModalHandler(event, resolve, type))
            else
            {
                await new Promise ((resolve) => setTimeout(resolve, 1000))
                removeModalHandler(null, resolve, null)
            }
            if (type)
                resolve()
        })
    },

    createModalHtml(type, message)
    {
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