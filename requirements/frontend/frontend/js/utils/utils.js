import { layoutTemplate } from '../templates/layoutTemplate.js'
import { tokenService } from '../managers/globalManager.js'
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
        body : JSON.stringify({"refresh" : tokenService.refreshToken})
    })
    if (response.status === 401)
    {
        console.log('->>>>>> refresh token was expired')
        tokenService.clear()
        document.getElementById('app').classList.remove('active')
        globalManager._router.handleRoute('/signin')
        return ; 
    }
    const responseBody = await response.json()
    tokenService.accessToken = responseBody.access
    func()
    return ;    
}