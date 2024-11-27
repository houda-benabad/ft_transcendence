import { SIGN_VIEW } from '../constants/sign.js'
import { signTemplate } from '../templates/signTemplate.js'
import { layoutTemplate } from '../templates/layoutTemplate.js'
import { formService } from '../services/formService.js'
import { apiService } from '../services/apiService.js'
import { eventHandlers } from './eventHandlers.js'

export async function init()
{
    const myApp = document.getElementById('app')

    myApp.innerHTML = signTemplate()
    await updateData()
    // SETTING UP THE EVENT LISTENERS
    const Anchor = document.getElementById('sign-anchor')
    const Anchor2 = document.querySelector('.intra')

    eventListeners.on(Anchor, 'click', eventHandlers.auth.signHandler)
    eventListeners.on(Anchor2, 'click', eventHandlers.auth.intraHandler)

    await formService.handleSign()
}


export function updateData()
{
    const value = document.getElementById('signDiv').getAttribute('data-value')

    const dataToChange = document.querySelectorAll('.sign').forEach(e => {
        e.innerHTML = value
    })
    document.querySelectorAll('input').forEach(e => { e.value = ''})

    const signText = document.getElementById('sign-text')
    const signAnchor = document.getElementById('sign-anchor')

    const text = (value === SIGN_VIEW.SIGN_UP) ? SIGN_VIEW.ALREADY_MEMBER : SIGN_VIEW.NO_ACCOUNT
    const text2 = (value === SIGN_VIEW.SIGN_UP) ? SIGN_VIEW.SIGN_IN : SIGN_VIEW.SIGN_UP

    signAnchor.innerHTML = text2
    signText.innerHTML = text

}

export async function sendData(ENDPOINTS)
{
    return new Promise(async (resolve) => {
        const form = document.querySelector('form')
        const formData = new FormData(form)
        const formObject = {}
        
        formData.forEach((value, key) => { formObject[key] = value })
        
        const response = await apiService.auth[ENDPOINTS](formObject)
        if (response === true)
            resolve(true)
    })
}

export async function reset()
{
    const app = document.getElementById('app')
    
    eventListeners.removeAll()
    //for the moment i ll comment it//waiting for the user to read the pop
    await new Promise(resolve => {
        // app.replaceChildren()
        app.innerHTML = '<div id="loader"></div>'
        // here where that feature of delay that hajar worked on should be added.
        setTimeout(resolve, 1500)
    })
    app.innerHTML = layoutTemplate()
    app.classList.add('active')
    
}