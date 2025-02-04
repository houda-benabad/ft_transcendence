
import { eventListeners } from "../managers/globalManager.js"

export const eventHandlers = 
{
    form :
    {   
        addPasswordForm(event, resolve)
        {
            event.preventDefault()

            const form = document.querySelector( 'form' )
            const data = new FormData(form)
            let   formObject = {}
            
            data.forEach((value, key) => { formObject[key] = value })
            resolve(formObject)
        }
    },
    game :
    {
        slider( event, mode )
        {
            const num = document.getElementById( 'slider-number' )
            const modeInput = document.getElementById( 'slider-mode' )
            const input = document.getElementById( 'slider-input' )

            if ( mode.value === 'score' )
                {
                    input.min = 1
                    input.max = 5
                    input.value = 1
                }
                else
                {
                    input.min = 10
                    input.max = 180
                    input.value = 10
                }
                num.innerHTML = `${input.value}`
                modeInput.innerHTML = `${mode.value}`
        },
        inputOfSlider(  )
        {
            const num = document.getElementById( 'slider-number' )
            const input = document.getElementById( 'slider-input' )

            num.innerHTML = `${input.value}`
        }
    },
    removeModalHandler( event, resolve , type) // what type of function is this
    {
        const modalBackground = document.getElementById( 'modal-background' )
        
        console.log('type : ', type)
        if (!event || (event && event.target === modalBackground ))
        {
            eventListeners.off( modalBackground, 'click', eventHandlers.removeModalHandler )
            modalBackground.remove(  )
            if (type === null)
                resolve(  ) 
        }
    }
}