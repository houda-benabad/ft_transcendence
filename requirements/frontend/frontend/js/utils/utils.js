import { layoutTemplate } from '../templates/layoutTemplate.js'
import { tokenService } from '../managers/globalManager.js'
import { globalManager } from '../managers/globalManager.js'
import { ENDPOINTS } from '../constants/endpoints.js'
import { eventListeners } from "../managers/globalManager.js"
import { modalService } from '../services/modalService.js'
import { onlineStatusService } from '../managers/globalManager.js'

export function removeModalHandler( event, resolve , type)
{
    const modalBackground = document.getElementById( 'modal-background' )
    
    if (!event || (event && event.target === modalBackground ))
    {
        eventListeners.off( modalBackground, 'click')
        modalBackground.remove(  )
        if (type === null)
            resolve(  ) 
    }
}
export function determineUserStatus(userId, relationship)
{
    const onlineFriendsList = onlineStatusService._onlineFriendsList
    const relationshipStatus = relationship ?  relationship.status : 'me'

    if ((relationshipStatus === 'friend' && onlineFriendsList.includes(Number(userId)) === true ) || relationshipStatus === 'me')
        return ('online')
    else if (relationshipStatus === 'friend' && onlineFriendsList.includes(Number(userId)) === false)
        return ('offline')
    else
        return ('')
}
export function  delay(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function write(text, speed)
{
    let i = 0
    const headerHighlight = document.getElementById('header-highlight')
    const h2 = document.createElement('h2')
    h2.id = "welcome-text"
    headerHighlight.replaceChildren(h2)

    async function typing()
    {
        if (i < text.length)
        {
            h2.innerHTML += text[i]
            i++

            await delay(speed)
            typing()
        }
    }

    typing()

}
export function unwrite(speed, target)
{
    let i = 0
    let text = target.innerHTML

    const intervalId = setInterval(async () => {
        if (text.length)
        {
            text = text.slice(0, -1)
            target.innerHTML = text
        }
        else
        {
            clearInterval(intervalId)
            setTimeout(() => {
                document.getElementById('header-highlight').innerHTML = '<img src="../../assets/componants/logo.png">'
            }, 3000)
        }
    }, speed)

}
export function loader(delay)
{
    const app = document.getElementById('app')

    return new Promise(resolve => {
        app.innerHTML = '<div id="loader"></div>'
        setTimeout(resolve, delay)
    })
}
export async function reset()
{
    const app = document.getElementById('app')
    
    await loader(1500)
    app.innerHTML = layoutTemplate()
    app.classList.add('active')
    document.getElementById('header-highlight').innerHTML = '<img src="../../assets/componants/logo.png">'
}
export function debounce(func, delay)
{
    let timeoutId

    return function(...args)
    {
        clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay);
    }
}
export async function tokenExpired(func = null)
{
    const response = await fetch(ENDPOINTS.REFRESH_TOKEN , {
        method : 'POST',
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({"refresh" : tokenService.refreshToken})
    })
    if (response.status === 401)
    {
        tokenService.clear()
        await modalService.show('the user is no more authenticated !!!', true)
        document.getElementById('app').classList.remove('active')
        await loader(700)
        globalManager._router.handleRoute('/signin')
        return ; 
    }
    const responseBody = await response.json()
    tokenService.accessToken = responseBody.access
    if (func !== null)
        func() 
}