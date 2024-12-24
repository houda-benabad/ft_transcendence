import { apiService } from '../services/apiService.js'

export class EventManager
{
    constructor(router)
    {
        console.log('im in here in the constructor')
        document.addEventListener('click', this.handleEventDelegation.bind(this))
        document.addEventListener('submit', this.handleEventDelegation.bind(this))
        document.addEventListener('input', this.handleEventDelegation.bind(this))

        this._router = router
    }
    handleEventDelegation(event)
    {
        const eventType = event.type
        const target = event.target

        if (target.matches('a'))
            this.handleAnchorEvents(event, target)
        else if (target.matches('form') && eventType === 'submit') // do not need that eventType submit
            this.handleformEvents(event, target)
    }
    handleAnchorEvents(event, target)
    {
        // console.log('im in here to handle anchors')
        event.preventDefault()

        const link = target.getAttribute('data-link')
        const action = target.getAttribute("data-action")

        if (link)
            this._router.handleRoute(link)
        else if (action)
        {
            console.log('what action : ', action)
        }
    }
    async handleformEvents(event, target)
    {
        event.preventDefault()
        
        const action = target.getAttribute("data-action")
        const form = document.querySelector('form')

        const formData = new FormData(form)
        const formObject = {}

        formData.forEach((value, key) => { formObject[key] = value }) // add the tournament form  and the game one .
        if (action === 'signin' || action === 'signup')
            apiService.auth[action](formObject)
    }
}

      // await this._apiService.signup(formObject)
        // console.log('out of the api service lets navigate now to sign in ? ')
        // this._router.handleRoute('/signin')
        //here post this values to the backend
//     eventListeners.on(Anchor, 'click', eventHandlers.auth.signHandler)
//     eventListeners.on(Anchor2, 'click', eventHandlers.auth.intraHandler)