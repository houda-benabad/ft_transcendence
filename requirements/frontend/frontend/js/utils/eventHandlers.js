import { modalService } from '../services/modalService.js'
import { searchService } from '../services/searchService.js'
import { GameManager } from "../managers/modesManager.js"
import { ENDPOINTS } from "../constants/endpoints.js"
import { onlineStatusService } from "../managers/globalManager.js"
import { tokenService } from "../managers/globalManager.js"
import { loader, write } from './utils.js'

export const eventHandlersForProfile = 
{
    animation : 
    {
        animateProgressBar()
        {
            const startTime = performance.now()
            const levelBar = document.getElementById('level-progress')
            const levelPercentage = levelBar.getAttribute('data-value')

            function update(currentTime)
            {
                const elapsedTime = currentTime - startTime
                const duration = (1500 * (levelPercentage / 100))
                const progress = Math.min(elapsedTime / duration, 1)
                const targetPorcentage = progress * levelPercentage

                levelBar.style.width = `${targetPorcentage}%`
                if (progress < 1)
                    requestAnimationFrame(update)

            }
            requestAnimationFrame(update)
        },
        changeLineForSelectedChoice()
        {
            let selectedChoice = document.querySelector('.selected-choice')
            const slidingLine = document.getElementById('sliding-line')

            slidingLine.style.width = `${selectedChoice.offsetWidth}px`
            slidingLine.style.transform = `translateX(${selectedChoice.offsetLeft}px)`
        },
        mouseOverSelectedChoice(target)
        {
            let selectedChoice = document.querySelector('.selected-choice')
            const slidingLine = document.getElementById('sliding-line')
            
            slidingLine.style.width = `${target.offsetWidth}px`
            slidingLine.style.transform = `translateX(${target.offsetLeft}px)`
            target.classList.add('hoovered')
        },
        mouseOutSelectedChoice(target)
        {
            let selectedChoice = document.querySelector('.selected-choice')
            const slidingLine = document.getElementById('sliding-line')

            slidingLine.style.width = `${selectedChoice.offsetWidth}px`
            slidingLine.style.transform = `translateX(${selectedChoice.offsetLeft}px)`
            target.classList.remove('hoovered')
        }
    },
    click : 
    {
        clickSelectedChoice(target)
        {
            let selectedChoice = document.querySelector('.selected-choice')
            const slidingLine = document.getElementById('sliding-line')

            slidingLine.style.width = `${target.offsetWidth}px`
            slidingLine.style.transform = `translateX(${target.offsetLeft}px)`
            selectedChoice.classList.remove('selected-choice')
            target.classList.add('selected-choice')

            const friendsBoxContainer = document.getElementById('friends-box-container')
            friendsBoxContainer.friendsList = target.id === 'friends' ? true : false
        }
    }
}


export const eventHandlersForEventManager = (eventManager) =>
({
    anchor : 
    {
        handleAnchorEvents(event, target)
        {
            event.preventDefault()
            
            const realTarget = target.classList.contains('anchor-box') ? target.querySelector('a') : target
            const link = realTarget.getAttribute('data-link')
            const action = realTarget.getAttribute("data-action")

            if (realTarget.getAttribute('href') === '/game-settings' && action === 'router')
                return ;
            if (link)
                return eventManager._router.handleRoute(link)
            else if (action)
            {
                const actionType =
                {
                    'router' : this.handleNavigation.bind(this),
                    'intra' : this.handleIntraCall.bind(this),
                    'profile' : this.handleProfileIcons.bind(this),
                    'friends' : this.handleFriendsIcons.bind(this),
    
                }
                const runAction = actionType[action]
                runAction(realTarget)
            }
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
        async handleLogout()
        {
            document.getElementById('app').classList.remove('active')
            tokenService.clear()
            await loader(500)
            eventManager._router.handleRoute('/signin')
            onlineStatusService.closeSocket()
        },
        async handleProfileIcons(target)
        {
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
                console.log('action == ', action)
                if (action === 'remove_friend')
                    onlineStatusService.removeFriend = id
                mainElement.relationshipStatus = 'stranger'
            }
            else 
                eventManager._router.handleRoute('/settings')
        },
        async handleFriendsIcons(target)
        {
            const action = target.getAttribute('action-type')
            const id = target.getAttribute('id')
            
            if (action === 'to_profile')
                eventManager._router.handleRoute('/profile')
            else if (action === 'send_request' || action === 'accept_request')
                await eventManager._apiService.friendship.postFriendship(action, id)
            else
                await eventManager._apiService.friendship.deleteFriendship(action, id)

            const friendsBoxItemId = target.closest('.friends-box-item').getAttribute('index')
            const friendsBoxContainer = document.getElementById('friends-box-container')
            friendsBoxContainer.updateDb = {index : friendsBoxItemId, action}
            
            if (action === 'accept_request')
                onlineStatusService.newFriend = id
            else 
                onlineStatusService.removeFriend = id
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
            if (action)
            {
                const runAction = actionType[action]
                runAction(target)
            }
        },
        async handleAddOfPassword(target)
        {
            await modalService.show('', false, 'add-password')
            
            const response = await eventManager._formService.handlePassword()
            const {current_password, new_password, confirm_password} = response
            
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
    div :
    {
        handleFriendsBoxItem(target)
        {
            const userId = target.getAttribute('userid')

            console.log('userid is : ', userId)
            eventManager._router.handleRoute(`/profile/${userId}`)
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
            eventManager._router.handleRoute(`/profile/${id}`)
        },
        handleSearchInput(event, target)
        {
            const value = event.target.value			

            if (value.length >= 1)
                eventManager._debounced(value)
        },
        handleSearchFocus()
        {
            setTimeout(() => 
            {
                const searchResults = document.getElementById('search-results') // dry

                if (!searchResults.classList.contains('clicked'))
                    searchService.clear()
            }, 300)
        }
    },
    form :
    {
        async handleformEvents(event, target)
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
                    setTimeout(() => eventManager._router.handleRoute('/signin'), 150)
                else
                {
                    
                    tokenService.tokens = response
                    const userInfos = await eventManager._apiService.user.getBasicDataOfUser()
                    
                    await eventManager._reset()
                    eventManager._router.handleRoute('/')
                    onlineStatusService.init()
                    
                    const text = `hello , ${userInfos.username}`
                    const welcomeText = document.getElementById('welcome-text')

                    write(text, 100, welcomeText)
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
        },
        handleSliderInput(target)
        {
            const num = document.getElementById( 'slider-number' )
            const input = document.getElementById( 'slider-input' )

            num.innerHTML = `${input.value}`
        },
        handleModeGameInput(target)
        {

            const num = document.getElementById( 'slider-number' )
            const modeInput = document.getElementById( 'slider-mode' )
            const input = document.getElementById( 'slider-input' )

            if ( target.value === 'score' )
                {
                    input.min = 1
                    input.max = 5
                    input.value = 1
                }
                else
                {
                    input.min = 10
                    input.max = 180
                    input.value = 10
                }
                num.innerHTML = `${input.value}`
                modeInput.innerHTML = `${target.value}`
        }
    }
})