import { updateData , sendData, reset} from './utils.js'
import { apiService } from '../services/apiService.js'
import router from '../router/router.js'
import { modalService } from '../services/modalService.js'
import { MODE } from '../constants/engine.js'
import { local } from '../mods/local.js'
import { formService } from '../services/formService.js'
import { gameManager } from './managers/gameManager.js'

export const eventHandlers = 
{
    auth :
    {
        signHandler(event)
        {
            const signAnchor = document.getElementById('sign-anchor')

            event.preventDefault()
            document.getElementById('signDiv').dataset.value = signAnchor.innerHTML
            updateData()
        },
        async intraHandler(event)
        {
            event.preventDefault()
            await apiService.auth.intra()
            await reset()
            router.init()
        }
    },
    form :
    {
        tournamentFormHandler(event)
        {
            const form = document.querySelector('form')

            event.preventDefault()
                
            let data = new FormData(form);
            let playersObject = Object.fromEntries(data)
            let players = Object.values(playersObject)
            
            // this players info need to be sent to hajar.
            //delete that form listener - -
        },
        gameFormHandler(event, resolve)
        {
            const form = document.querySelector('form')

            event.preventDefault()

            let data = new FormData(form);
            let gameSettings = Object.fromEntries(data)
            resolve(gameSettings)
            // here the data of the form need to be sent to hajar
            //delete that form listener
        }
    },

    removeModalHandler(event, resolve) // what type of function is this
    {
        const modalBackground = document.getElementById('modal-background')
        
        if (event.target === modalBackground)
        {
            eventListeners.off(modalBackground, 'click', eventHandlers.removeModalHandler)
            modalBackground.remove()
            resolve()
        }
    },
    router : 
    {
        anchorsNavHandler(event, e)
        {
            document.querySelectorAll('.static').forEach((item) => item.classList.remove('selected'))
            e.classList.add('selected')

            event.preventDefault()
            const path = e.getAttribute('href')
            router.navigateTo(path)
        },
        popstateHandler(event)
        {
            const path = event.state ? event.state.path : './home'
            router.navigateTo(path, false)

            document.querySelectorAll('.static').forEach((item) => item.classList.remove('selected'))
            document.querySelector(`a[href="${path}"]`).classList.add('selected')
        }
    },
    home :
    {
        playGame(event)
        {
            const mode = event.target.dataset.mode
            const myGameManager = new gameManager()

            if (mode === 'local')
                myGameManager.local()
        }
    //     async local()
    //     {
    //         // game settings
    //         await router.navigateTo('./game-settings')
    //         const gameSettings = await formService.game()

    //         router.navigateTo('./game')

    //         const game = await local(gameSettings)

    //         await modalService.show( 'Game over', 'hihi')

    //         game.clean()
    //         await reset()
    //         router.navigateTo('./home')


    //     }
    },
    game :
    {
        slider(event, mode)
        {
            const num = document.getElementById('slider-number')
            const modeInput = document.getElementById('slider-mode')
            const input = document.getElementById('slider-input')

            if (mode.value === 'score')
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
        inputOfSlider()
        {
            const num = document.getElementById('slider-number')
            const input = document.getElementById('slider-input')

            num.innerHTML = `${input.value}`
        }
    },
    settings :
    {
        updateImage()
        {
            console.log('the image is to be updated')
        },
        deleteImage()
        {
            console.log('the image is to be deleted')
        },
        saveUsername()
        {
            console.log('a new username got to be updated')
        },
        addPassword()
        {
            console.log('update the user password')
        },
        twofa()
        {
            console.log('two fa was activated or desactivated')
        },
        deleteAccount()
        {
            console.log('the account need to be deleted')
        }
    }
}