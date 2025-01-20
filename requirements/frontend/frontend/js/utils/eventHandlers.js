// import { updateData , sendData, reset} from './utils.js'
// import { apiService } from '../services/apiService.js'
// import router from '../router/router.js'
// import { modalService } from '../services/modalService.js'
// import { MODE } from '../constants/engine.js'
// import { local } from '../mods/local.js'
// import { formService } from '../services/formService.js'
import { eventListeners } from "../managers/globalManager.js"
import { gameManager } from '../managers/gameManager.js'
// import { remote } from '../mods/remote.js'

//break it into small chunks and cleanse this out .
export const eventHandlers = 
{
    auth :
    {
        signHandler( event )
        {
            const signAnchor = document.getElementById( 'sign-anchor' )

            event.preventDefault(  )
            document.getElementById( 'signDiv' ).dataset.value = signAnchor.innerHTML
            updateData(  )
        },
        async intraHandler( event )
        {
            event.preventDefault(  )
            await apiService.auth.intra(  )
            await reset(  )
            router.init(  )
        }
    },
    form :
    {
        tournamentFormHandler( event, resolve )
        {
            const form = document.querySelector( 'form' )

            event.preventDefault(  )
                
            let data = new FormData( form );
            let playersObject = Object.fromEntries( data )
            let players = Object.values( playersObject )
            resolve( players )
        },
        gameFormHandler( event, resolve )
        {
            console.log('im in hereeee')
            const form = document.querySelector( 'form' )

            event.preventDefault(  )

            let data = new FormData( form );
            let gameSettings = Object.fromEntries( data )
            resolve( gameSettings )
        },
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
    router : 
    {
        anchorsNavHandler( event, e )
        {
            document.querySelectorAll( '.static' ).forEach( ( item ) => item.classList.remove( 'selected' ) )
            e.classList.add( 'selected' )

            event.preventDefault(  )
            const path = e.getAttribute( 'href' )
            router.navigateTo( path )
        },
        popstateHandler( event )
        {
            const path = event.state ? event.state.path : '/home'
            router.navigateTo(path, false)

            document.querySelectorAll( '.static' ).forEach( ( item ) => item.classList.remove( 'selected' ) )
            document.querySelector( `a[href="${path}"]` ).classList.add( 'selected' )
        }
    },
    // i do think this as a constructor it would be a good idea - 
    home :
    {
        async playGame( event )
        {
            const mode = event.target.dataset.mode
            const manager = new gameManager(  )

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
    removeModalHandler( event, resolve ) // what type of function is this
    {
        const modalBackground = document.getElementById( 'modal-background' )
        
        if (event && event.target === modalBackground )
        {
            eventListeners.off( modalBackground, 'click', eventHandlers.removeModalHandler )
            modalBackground.remove(  )
            resolve(  ) // do i really need to resolve
        }
        else if (!event)
        {
            eventListeners.off( modalBackground, 'click', eventHandlers.removeModalHandler )
            modalBackground.remove(  )
            resolve(  )
        }
    }
}