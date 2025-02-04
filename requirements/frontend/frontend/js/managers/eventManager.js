import { modalService } from '../services/modalService.js'
import { searchService } from '../services/searchService.js'
import { GameManager } from './gameManager.js'
import { ENDPOINTS } from '../constants/endpoints.js'
import { onlineStatusService } from './globalManager.js'
import { tokenService } from './globalManager.js'

export class EventManager
{
	constructor(global)
	{
		this._apiService = global._apiService
		this._router = global._router
		this._reset =  global._reset

		this._eventHandlers = eventHandlers(this)
		this.init()
    } 
	init()
	{
		document.addEventListener('click', this.handleEventDelegationForClick.bind(this))
		document.addEventListener('submit', this.handleEventDelegationForSubmit.bind(this))
		document.addEventListener('input', this.handleEventDelegationForInput.bind(this))
		document.addEventListener('focusout', this.handleEventDelegationFocusout.bind(this))
	}
	handleEventDelegationForClick(event)
	{
        const target = event.target

		if (target.matches('a'))
            this._eventHandlers.anchor.handleAnchorEvents(event, target)
        else if (target.matches('button'))
            this._eventHandlers.button.handleButtonEvents(target)
		else if (target.classList.contains('search-item'))
            this._eventHandlers.search.handleSearchItem(target)
	}
	handleEventDelegationForSubmit(event)
	{
		const target = event.target

		if (target.matches('form') && target.id === 'sign')
			this._eventHandlers.form.handleformEvents(event, target)
	}
	handleEventDelegationForInput(event)
	{
		const target = event.target

		if (target.id === 'search-input')
			this._eventHandlers.search.handleSearchInput(event)
		else if (target.id === 'user-input-img')
			this._eventHandlers.input.handleInputFiles(target)
	}
	handleEventDelegationFocusout(event)
	{
		const target = event.target

		if (target.id === 'search-input')
            this._eventHandlers.search.handleSearchFocus()
	}

}

const eventHandlers = (eventManager) =>
({
	anchor : 
	{
		handleAnchorEvents(event, target)
		{
			event.preventDefault()

			const link = target.getAttribute('data-link')
			const action = target.getAttribute("data-action")

			console.log('in anchor events')
			console.log('link ', link)
			console.log('action : ', action)
			if (link)
				return eventManager._router.handleRoute(link)
			
			const actionType =
			{
				'router' : this.handleNavigation.bind(this),
				'intra' : this.handleIntraCall.bind(this),
				'profile' : this.handleProfileIcons.bind(this),
				'friends' : this.handleFriendsIcons.bind(this),

			}
			const runAction = actionType[action]

			runAction(target)
		},
		async handleIntraCall(target)
		{
			const response = await eventManager._apiService.auth.intraAuthorize()

			window.location.href = response.intra_auth_url
    	},
		handleNavigation(target)
		{
			const newPath = target.getAttribute('href')

			if (newPath === '/logout')
				this.handleLogout()
			else
				eventManager._router.handleRoute(newPath)
		},
		handleLogout()
		{
			document.getElementById('app').classList.remove('active')
			tokenService.clear()
			eventManager._router.handleRoute('/signin')
			onlineStatusService.closeSocket()
		},
		async handleProfileIcons(target)
		{
			console.log('target : ', target)
			const action = target.getAttribute('action-type')
			const id = target.getAttribute('id')
			const mainElement = target.closest(['[class="icons"]'])
	
			if (action === 'send_request' || action === 'accept_request')
			{
				await eventManager._apiService.friendship.postFriendship(action, id)
				if (action === 'send_request')
					mainElement.relationshipStatus = 'requested'
				else
				{
					onlineStatusService.newFriend = id
					mainElement.relationshipStatus = 'friend'
				}
			}
			else if (action === 'remove_friend' || action === 'cancel_request' || action === 'reject_request')
			{
				await eventManager._apiService.friendship.deleteFriendship(action, id)
				mainElement.relationshipStatus = 'stranger'
			}
			else 
				eventManager._router.handleRoute('/settings')
		},
		async handleFriendsIcons(target)
		{
			const action = target.getAttribute('action-type')
			const id = target.getAttribute('id')
			if (action === 'send_request' || action === 'accept_request')
				await this._apiService.friendship.postFriendship(action, id)
			else
				await this._apiService.friendship.deleteFriendship(action, id)
		
			// updating the ui
			const friendsBoxItemId = target.closest('.friends-box-item').id
			const friendsBoxContainer = document.getElementById('friends-box-container')
			friendsBoxContainer.updateDb = {index : friendsBoxItemId, action}
			
			if (action === 'accept_request')
			{
				onlineStatusService.newFriend = id
			}
		}
	},
	button :
	{
		handleButtonEvents(target)
		{
			const action = target.getAttribute("data-action")
			const actionType =
			{            
				'play_game' : this.handleGame.bind(this),
				'update_image' : this.handleImgUpdate.bind(this),
				'delete_image' : this.handleDeleteOfImage.bind(this),
				'save_username' : this.handleNewUsername.bind(this),
				'add_password' : this.handleAddOfPassword.bind(this),
			}
			console.log('in buttons action is  : ', action)
			if (action)
			{
				const runAction = actionType[action]
				runAction(target)
			}
		},
		async handleAddOfPassword(target)
		{
			const response = await modalService.show('', false, 'add-password')
	
			// validate password
			const {current_password, new_password, confirm_password} = response
			
			console.log('confirm : ', confirm_password)
			if (new_password !== confirm_password)
				return modalService.show('confirm the password again !!!')
			
			await eventManager._apiService.settings.updatePassword({new_password : new_password, current_password :  current_password})
		},
		async handleNewUsername(target)
		{
			const input = document.getElementById('username-to-save')
			const inputValue = input.value	

			if (!inputValue || inputValue.includes(' '))
				modalService.show('enter a valid username')
			else if (inputValue === input.placeholder)
				modalService.show('you already have the same username  - -')
			else
				await eventManager._apiService.settings.updateUsername({new_username : inputValue})
		
			input.value = ''
			input.placeholder = inputValue
		},
		async handleGame(target)
		{
			const gameMode = target.getAttribute("data-game-mode")
			const gameManager = new GameManager( )
			await gameManager[gameMode]()
		},
		handleImgUpdate(target)
		{
			const input = document.getElementById('user-input-img')

			input.click()
		},
		async handleDeleteOfImage(target)
		{
			const response = await eventManager._apiService.settings.updateImage({reset_image : true})

			const img = document.getElementById('tobe-updated-img')

			img.src = response.avatar
			modalService.show('deleted the image successfully', true)
		}
	},
	search : 
	{
		handleSearchItem(target)
		{
			const searchResults = document.getElementById('search-results')
			const id = target.id

			searchResults.classList.add('clicked')
			searchService.clear()
			this._router.handleRoute(`/profile/${id}`)
		},
		handleSearchInput(event, target)
		{
			const debounced = searchService.debounce(searchService.performSearch.bind(this), 500)
			const value = event.target.value			

			if (value.length >= 1)
				debounced(value)
		},
		handleSearchFocus()
		{
			setTimeout(() => 
			{
				const searchResults = document.getElementById('search-results') // dry

				// console.log('->>>>>>>>>>>my searched results after lost focus : ', searchResults)
				if (!searchResults.classList.contains('clicked'))
					searchService.clear()
			}, 300)
			// console.log('IM OUT OF FOCUSSSSS OUYTTTTTT') // gotta not use focus out
		}
	},
	form :
	{
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
				const response = await eventManager._apiService.auth[action](formObject)

				if (action  === 'signup')
					setTimeout(() => eventManager._router.handleRoute('/signin'), 1000)
				else
				{
					tokenService.tokens = response
					await eventManager._reset()
					eventManager._router.handleRoute('/')
					onlineStatusService.init()
				}
			}
		}
	},
	input :
	{
		async handleInputFiles(target)
		{
			const file = target.files[0]
			const formData = new FormData()
			
			formData.append('avatar', file) 
			const temporaryFilePath = URL.createObjectURL(file)
			const response = await fetch(ENDPOINTS.SETTINGS_PIC_UPDATE , {
				method : 'PUT',
				headers : {
					"Authorization": `Bearer ${tokenService.accessToken}`,
				},
				body : formData
			})

			const img = document.getElementById('tobe-updated-img')

			img.src = temporaryFilePath
			modalService.show('the image was uploaded successfully', true)
		}
	}
})