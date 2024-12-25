import { apiService } from '../services/apiService.js'
import { _tokenService } from '../utils/global.js'
import { reset } from '../utils/utils.js'

export class EventManager
{
    constructor(router)
    {
        document.addEventListener('click', this.handleEventDelegation.bind(this))
        document.addEventListener('submit', this.handleEventDelegation.bind(this))
        document.addEventListener('input', this.handleEventDelegation.bind(this))

        this._router = router
        this._actionType = 
        {
            'router' : this.handleNavigation.bind(this)
        }
    }
    handleEventDelegation(event)
    {
        const eventType = event.type
        const target = event.target

        // console.log('event type : ', eventType)
        // console.log('event target : ', target)

        if (target.matches('a'))
            this.handleAnchorEvents(event, target)
        else if (target.matches('form') && eventType === 'submit') // do not need that eventType submit
            this.handleformEvents(event, target)
    }
    handleAnchorEvents(event, target)
    {
        // console.log('im in handleanchorEvents')
        event.preventDefault()

        const link = target.getAttribute('data-link')
        const action = target.getAttribute("data-action")

        if (link)
            this._router.handleRoute(link)
        else if (action)
        {
            const runAction = this._actionType[action]

            runAction(target)
        }
    }
    async handleformEvents(event, target) // this need to be made more generic and cleaner and maintenable .
    {
        // console.log('im in handle formEvents')
        event.preventDefault()
        
        const action = target.getAttribute("data-action")
        const form = document.querySelector('form')

        const formData = new FormData(form)
        const formObject = {}

        formData.forEach((value, key) => { formObject[key] = value }) // add the tournament form  and the game one .
        if (action === 'signin' || action === 'signup')
        {
            console.log('action : ', action)
            const response = await apiService.auth[action](formObject)

            if (action  === 'signup')
                this._router.handleRoute('/signin')
            else
            {
                _tokenService.token = response.auth_token
                await reset()
                this._router.handleRoute('/')
            }
        }
    }
    handleNavigation(target)
    {
        const newPath = target.getAttribute('href')

        this._router.handleRoute(newPath)
        document.querySelectorAll( '[data-action="router"]' ).forEach( ( item ) => item.classList.remove( 'selected' ) )
        target.classList.add( 'selected' )
    }
}