import { apiService } from '../services/apiService.js'
import { searchService } from '../services/searchService.js'
import { _tokenService } from '../utils/global.js'
import { reset } from '../utils/utils.js'
import { router } from '../utils/global.js'
import { MODE } from '../constants/engine.js'
import { remote } from '../mods/remote.js'
import { multiplayer } from '../mods/multiplayer.js'


export class EventManager
{
    constructor(router)
    {
        document.addEventListener('click', this.handleEventDelegation.bind(this))
        document.addEventListener('submit', this.handleEventDelegation.bind(this))
        document.addEventListener('input', this.handleEventDelegation.bind(this))
        document.addEventListener('focusout', this.handleEventDelegation.bind(this))
        // document.addEventListener('change', this.handleEventDelegation.bind(this))

        this._actionType = 
        {
            'router' : this.handleNavigation.bind(this),
            'profile' : this.handleProfileIcons.bind(this),
            'friends' : this.handleFriendsIcons.bind(this),
            'play_game' : this.handleGame.bind(this),
            'intra' : this.handleIntraCall.bind(this)
        }
    } 
    async handleIntraCall(target)
    {
        apiService.auth.intraCall()
    }
    handleEventDelegation(event)
    {
        const eventType = event.type
        const target = event.target

        console.log('event type : ', eventType)
        console.log('event target : ', target)

        if (eventType === 'focusout' && target.id === 'search-input')
            this.handleSearchFocus()
        else if (eventType === 'click' && target.matches('a'))
            this.handleAnchorEvents(event, target)
        else if (eventType === 'click' && target.matches('button'))
            this.handleButtonEvents(target)
        else if (target.matches('form') && eventType === 'submit' && target.id === 'sign') // do not need that eventType submit
            this.handleformEvents(event, target)
        else if (eventType === 'input' && target.id === 'search-input')
            this.handleSearchInput(event, target)
        else if (eventType === 'click' && target.classList.contains('search-item'))
            this.handleSearchItem(target)
    }
    async handleProfileIcons(target)
    {
        const action = target.getAttribute('action-type')
        const id = target.getAttribute('id')
        const mainElement = target.closest(['[class="icons"]'])

        // console.log('main Element : ', mainElement)
        // console.log('in here : ', userId)
        // console.log('target : ', target)
        if (action === 'send_request' || action === 'accept_request')
        {
            await apiService.friendship.postFriendship(action, id)
            if (action === 'send_request')
                mainElement.relationshipStatus = 'requested'
            else
                mainElement.relationshipStatus = 'friend'
        }
        else if (action === 'remove_friend' || action === 'cancel_request' || action === 'reject_request')
        {
            await apiService.friendship.deleteFriendship(action, id)
            mainElement.relationshipStatus = 'stranger'
        }
        else 
            router.handleRoute('/settings')
    }   
    async handleFriendsIcons(target)
    {
        const action = target.getAttribute('action-type')
        const id = target.getAttribute('id')

        console.log('here  id  : ', id)
        console.log('target : ', target)
        if (action === 'send_request' || action === 'accept_request')
            await apiService.friendship.postFriendship(action, id)
        else
            await apiService.friendship.deleteFriendship(action, id)
    }
    async handleformEvents(event, target) // this need to be made more generic and cleaner and maintenable .
    {
        event.preventDefault()
        
        const action = target.getAttribute("data-action")
        const form = document.querySelector('form')

        const formData = new FormData(form)
        if (action === 'signin' || action === 'signup')
        {
            const formObject = {}
            formData.forEach((value, key) => { formObject[key] = value})
            const response = await apiService.auth[action](formObject)

            if (action  === 'signup')
                setTimeout(() => router.handleRoute('/signin'), 1000)
             else
            {
                _tokenService.tokens= response
                await reset()
                router.handleRoute('/')
            }
        }
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
            console.log('action : ', action)
            const runAction = this._actionType[action]

            runAction(target)
        }
    }
    handleButtonEvents(target)
    {
        const action = target.getAttribute("data-action")

        if (action)
        {
            const runAction = this._actionType[action]

            runAction(target)
        }
    }
    async handleGame(target)
    {
        const gameMode = target.getAttribute("data-game-mode")

        if ( gameMode === MODE.LOCAL ){
            await router.navigateTo( '/game-settings' )
            this.gameSettings = await formService.game()
            router.navigateTo( '/game' )
            await local( this.gameSettings , ["player1", "player2"])
            await modalService.show(  'Game over', 'hihi' )
            await reset(  )
            router.navigateTo( '/' )
        }
        else if ( gameMode == MODE.TOURNAMENT){
            const players = await modalService.show(  '', false, 'tournament' ) // the alias names for the players 
            await router.navigateTo( '/game-settings' )
            this.gameSettings = await formService.game(  )
            router.navigateTo( '/game' )
            const winners = []
            winners[0] = await local(  this.gameSettings, [players[0], players[1]]  )
            winners[1] = await local(  this.gameSettings , [players[2], players[3]] )
            const winner = await local(  this.gameSettings , winners )
            await modalService.show(  'Game over', 'hihi' )
            await reset(  )
            router.navigateTo( '/' )
        }
        else if ( gameMode == MODE.REMOTE ){
            await remote( )
            // await modalService.show(  'Game over', 'hihi' )
            await reset(  )
            router.navigateTo( '/' )
        }
        else if ( gameMode == MODE.MULTIPLAYER ){
            await multiplayer( )
            // await modalService.show(  'Game over', 'hihi' )
            await reset(  )
            router.navigateTo( '/' )
        }
        console.log('in hereee hajar u should take the functions from event handlers and out it in here: ' , gameMode)

    }
    handleNavigation(target)
    {
        const newPath = target.getAttribute('href')

        if (newPath === '/logout')
            this.handleLogout()
        else
       
        router.handleRoute(newPath)
    }
    handleLogout()
    {
        document.getElementById('app').classList.remove('active')
        _tokenService.clear()
        router.handleRoute('/signin')
    }
}