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

    // console.log('liost : ', onlineFriendsList)
    // console.log('userid : ',  userId)
    // console.log('type of : ', typeof userId)
    // console.log('userid included  : ', onlineFriendsList.includes(Number(userId)))
    // console.log('relation : ', relationshipStatus)
    if ((relationshipStatus === 'friend' && onlineFriendsList.includes(Number(userId)) === true ) || relationshipStatus === 'me')
        return ('online')
    else if (relationshipStatus === 'friend' && onlineFriendsList.includes(Number(userId)) === false)
        return ('offline')
    else
        return ('unknown')
}
export function  delay(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function write(text, speed, target)
{
    let i = 0

    
    async function typing()
    {
        if (i < text.length)
        {
            target.innerHTML += text[i]
            i++

            await delay(speed)
            typing()
        }
    }

    typing()

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