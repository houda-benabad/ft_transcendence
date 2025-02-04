import { layoutTemplate } from '../templates/layoutTemplate.js'
import { ENDPOINTS } from '../constants/endpoints.js'
import { globalManager } from '../managers/globalManager.js'

export async function reset()
{
    const app = document.getElementById('app')
    
    await new Promise(resolve => {
        app.innerHTML = '<div id="loader"></div>'
        setTimeout(resolve, 1500)
    })
    app.innerHTML = layoutTemplate()
    app.classList.add('active')
    
}
export async function tokenExpired(func = null)
{
    console.log('->>>>>>> access token was expired')
    const response = await fetch(ENDPOINTS.REFRESH_TOKEN , {
        method : 'POST',
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({"refresh" : globalManager._tokenService.refreshToken})
    })
    if (response.status === 401)
    {
        console.log('->>>>>> refresh token was expired')
        globalManager._tokenService.clear()
        document.getElementById('app').classList.remove('active')
        globalManager._router.handleRoute('/signin')
        return ; 
    }
    //SOKECT TO VCLOSEEEE
    const responseBody = await response.json()
    globalManager._tokenService.accessToken = responseBody.access
    if (func !== null)
        func()
}