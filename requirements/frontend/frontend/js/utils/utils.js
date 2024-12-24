import { SIGN_VIEW } from '../constants/sign.js'
import { signTemplate } from '../templates/signTemplate.js'
import { layoutTemplate } from '../templates/layoutTemplate.js'
import { formService } from '../services/formService.js'
import { apiService } from '../services/apiService.js'
import { eventHandlers } from './eventHandlers.js'
// import { eventListeners } from './global.js'

// export async function sendData(ENDPOINTS)
// {
//     return new Promise(async (resolve) => {
//         const form = document.querySelector('form')
//         const formData = new FormData(form)
//         const formObject = {}
        
//         formData.forEach((value, key) => { formObject[key] = value })
        
//         const response = await apiService.auth[ENDPOINTS](formObject)
//         if (response === true)
//             resolve(true)
//     })
// }

export async function reset()
{
    const app = document.getElementById('app')
    
    // eventListeners.removeAll()
    // //for the moment i ll comment it//waiting for the user to read the pop
    // await new Promise(resolve => {
    //     // app.replaceChildren()
    //     app.innerHTML = '<div id="loader"></div>'
    //     // here where that feature of delay that hajar worked on should be added.
    //     setTimeout(resolve, 1500)
    // })
    app.innerHTML = layoutTemplate()
    app.classList.add('active')
    
}