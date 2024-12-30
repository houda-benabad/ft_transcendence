import { apiService } from '../services/apiService.js'
import { searchService } from '../services/searchService.js'
import { _tokenService } from '../utils/global.js'
import { reset } from '../utils/utils.js'
import { router } from '../utils/global.js'

export class EventManager
{
    constructor(router)
    {
        document.addEventListener('click', this.handleEventDelegation.bind(this))
        document.addEventListener('submit', this.handleEventDelegation.bind(this))
        document.addEventListener('input', this.handleEventDelegation.bind(this))
        document.addEventListener('focusout', this.handleEventDelegation.bind(this))
        this._actionType = 
        {
            'router' : this.handleNavigation.bind(this),
            'edit_profile'  : this.handleEdit.bind(this),
            'friendship' : this.handleFriendship.bind(this)
        }
    }
    async handleFriendship(target)
    {
        const action = target.getAttribute('action-type')
        const userId = target.getAttribute('userId')
        const mainElement = target.closest(['[class="icons"]'])

        // console.log('main Element : ', mainElement)
        // console.log('in here : ', userId)
        // console.log('target : ', target)
        if (action === 'send_request' || action === 'accept_request')
        {
            await apiService.friendship.postFriendship(action, userId)
            if (action === 'send_request')
                mainElement.relationshipStatus = 'requested'
            else
                mainElement.relationshipStatus = 'friend'
        }
        else if (action === 'remove_friend' || action === 'cancel_request')
        {
            await apiService.friendship.deleteFriendship(action, userId)
            mainElement.relationshipStatus = 'stranger'
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
            // console.log('action : ', action)
            const response = await apiService.auth[action](formObject)

            if (action  === 'signup')
                router.handleRoute('/signin')
            else
            {
                _tokenService.tokens= response
                console.log('response : ', response)
                await reset()
                router.handleRoute('/')
            }
        }
    }
    // async handleSendRequest(target)
    // {
    //     // dry
    //     const action = target.getAttribute('action')
    //     const userId = target.getAttribute('userId')

    //     await apiService.profile.postFriendship(`${action}/${userId}`)
    //     target.action = 'cancel_request'
    // }
    // async handleAcceptRequest(target)
    // {
    //     // dry
    //     const action = target.getAttribute('action')
    //     const userId = target.getAttribute('userId')
        
    //     await apiService.profile.postFriendship(`${action}/${userId}`)
    //     target.action = 'to_profile'
    // }
    // async handleRemoveFriend(target)
    // {
    //     //dry
    //     const action = target.getAttribute('action')
    //     const userId = target.getAttribute('userId')

    //     await apiService.profile.deleteFriendship(`${action}/${userId}`)
    //     target.action = 'send_request'
    // }
    // async handleCancelRequest()
    // {
    //     //dry
    //     const action = target.getAttribute('action')
    //     const userId = target.getAttribute('userId')

    //     await apiService.profile.deleteFriendship(`${action}/${userId}`)
    //     target.action = 'send_request'
    // }
    handleEventDelegation(event)
    {
        const eventType = event.type
        const target = event.target

        // console.log('event type : ', eventType)
        // console.log('event target : ', target)

        if (eventType === 'focusout' && target.id === 'search-input')
            this.handleSearchFocus()
        else if (target.matches('a'))
            this.handleAnchorEvents(event, target)
        else if (target.matches('form') && eventType === 'submit') // do not need that eventType submit
            this.handleformEvents(event, target)
        else if (eventType === 'input' && target.id === 'search-input')
            this.handleSearchInput(event, target)
        else if (eventType === 'click' && target.classList.contains('search-item'))
            this.handleSearchItem(target)
    }
    handleSearchFocus()
    {
        setTimeout(() => 
        {
            const searchResults = document.getElementById('search-results') // dry

            // console.log('my searched results after lost focus : ', searchResults)
            if (!searchResults.classList.contains('clicked'))
                searchService.clear()
        }, 100)
    }
    handleSearchItem(target)
    {
        // console.log('im in hereee !!!')
        const searchResults = document.getElementById('search-results')
        const id = target.id

        searchResults.classList.add('clicked')
        searchService.clear()
        router.handleRoute(`/profile/${id}`)
    }
    handleSearchInput(event, target)
    {
       const debounced = searchService.debounce(searchService.performSearch.bind(this), 500)

        const value = event.target.value

        if (value.length >= 1)
            debounced(value)
    }
    handleAnchorEvents(event, target)
    {
        event.preventDefault()

        const link = target.getAttribute('data-link')
        const action = target.getAttribute("data-action")

        if (link)
            router.handleRoute(link)
        else if (action)
        {
            // console.log('action : ', action)
            const runAction = this._actionType[action]

            runAction(target)
        }
    }
    handleNavigation(target)
    {
        const newPath = target.getAttribute('href')

        router.handleRoute(newPath)
    }
    handleEdit()
    {
        router.handleRoute('/settings')
    }
}