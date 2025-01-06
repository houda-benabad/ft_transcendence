import { ENDPOINTS } from '../constants/endpoints.js'
import { _tokenService } from '../utils/global.js'
import { modalService } from './modalService.js'
import { router } from '../utils/global.js'

class RequestConfiguration
{
    constructor()
    {
        this._config = 
        {
            endpoint : '',
            method : 'GET',
            needsAuth : true,
            showModal : false,
            modalMessage : '',
            body : null,
            params : null
        }
    }
    get requestConfig()
    {
        return this._config
    }
    withEndpoint(endpoint)
    {
        this._config.endpoint = endpoint
        return this
    }
    withMethod(method)
    {
        this._config.method = method
        return this
    }
    withAuth(needsAuth)
    {
        this._config.needsAuth= needsAuth
        return this
    }
    withModal(modalMessage)
    {
        this._config.showModal = true
        this._config.modalMessage = modalMessage
        return this
    }
    withBody(body)
    {
        this._config.body = body
        return this
    }
    withParams(params)
    {
        this._config.params = params
        return this
    }
}


class ApiService
{
    constructor()
    {
        this._requestConfig =  null
        this._resolve = null
    }
    set requestConfig(newValue)
    {
        this._requestConfig =  newValue

        // console.log('im setting the value of new config : ', this._requestConfig)
    }
    set resolve(newValue)
    {
        this._resolve = newValue
    }
    async request()
    {
        let {
            endpoint,
            method,
            needsAuth,
            body,
            params
        } = this._requestConfig

        const url = params ? `${endpoint}?${params.key}=${encodeURIComponent(params.value)}` : endpoint
        // console.log('->>>> url : ', url)
        // console.log('config : ', this._requestConfig)
        try{
            const response = await fetch(url , {
                method,
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": needsAuth ? `Bearer ${_tokenService.accessToken}` : null, // for the moment no token variable does exist.
                },
                body : body ? JSON.stringify(body) : null
            })
            // console.log('response : ', response)
            if (needsAuth && response.status === 401)
                return await this.manageExpiredTokens()
            if (response.status === 500)
                throw new Error(response.status)
            const contentType = response.headers.get('Content-Type');
            if (!contentType)
                return await this.finishingUp()

            const responseBody = await response.json()
            if (!response.ok)
                this.handleMessaageErrors(responseBody)
            else 
                return await this.finishingUp(responseBody)
        }
        catch(error)
        {
            console.log('the error that was caught in api service is ', error)
        }
    }
    async finishingUp(response =  null)
    {
        const {showModal , modalMessage} = this._requestConfig

        if (showModal)
            await modalService.show(modalMessage, true)

        this._resolve(response)
    }
   async manageExpiredTokens()
    {
        // console.log('->>>>>> access token was expired')
        const response = await fetch(ENDPOINTS.REFRESH_TOKEN , {
            method : 'POST',
            headers : {
                "Content-Type": "application/json"
            },
            body : JSON.stringify({"refresh" : _tokenService.refreshToken})
        })
        if (response.status === 401)
        {
            // console.log('->>>>>> refresh token was expired')
            _tokenService.clear()
            document.getElementById('app').classList.remove('active')
            router.handleRoute('/signin')
            return ;
        }
        // console.log('im in here doing some work')
        const responseBody = await response.json()
        _tokenService.accessToken = responseBody.access
        this.request()
    }    
    async handleMessaageErrors(responseBody)
    {
        const {showModal} = this._requestConfig
        const entries = Object.entries(responseBody)
        const [key, value] = entries[0]

        if (showModal)
            await modalService.show(`${key} : ${value}`)
    }
}


const generateHttpRequests = (api) =>
({
    createPostRequest(endpoint, {needsAuth, modalMessage}) // see if gotta make this object empty
    {
        return async (body, resolve) => {
            const request = new RequestConfiguration()
                .withEndpoint(endpoint)
                .withMethod('POST')
                .withBody(body)
                .withAuth(needsAuth)

            if (modalMessage)
                request.withModal(modalMessage)        
            api.requestConfig = request.requestConfig
            api.resolve = resolve
            await api.request()
        }
    },
    createGetRequest(endpoint,  needsAuth = null)
    {
        return (resolve, params = null) => 
        {
            const request = new RequestConfiguration()
                .withEndpoint(endpoint)
            
            
            // console.log('->>> ', needsAuth)
            if (needsAuth !== null)
                request.withAuth(needsAuth)
            if (params)
                request.withParams(params)
            api.requestConfig = request.requestConfig
            api.resolve = resolve
            api.request()
        }
    },
    createDeleteRequest(endpoint, modalMessage = null)
    {
        return (resolve) => 
        {
            const request = new RequestConfiguration()
                .withEndpoint(endpoint)
                .withMethod('DELETE')
                
            if (modalMessage)
                request.withModal(modalMessage)

            api.requestConfig = request.requestConfig
            // console.log('here config : ', request.requestConfig)
            api.resolve = resolve
            api.request()
        }
    }
})
const api = new ApiService()
const generatedHttpRequests = generateHttpRequests(api)

export const apiService = 
{
    auth :
    {
        signin : (body) => new Promise (resolve => 
        {
            generatedHttpRequests.createPostRequest(ENDPOINTS.SIGN_IN, {needsAuth : false, modalMessage: 'welcome to pingy !!!'})(body, resolve)
        }),
        signup : (body) => new Promise (resolve => 
        {
            generatedHttpRequests.createPostRequest(ENDPOINTS.SIGN_UP, {needsAuth : false, modalMessage: 'you signed up successffully'})(body, resolve)
        }),
        intraCall :() => new Promise (resolve => {
            const popup = window.open(ENDPOINTS.INTRA, 'loginWithIntra', 'height=500,width=700')

            console.log('test : ', popup)
            window.addEventListener('message' , (event) => 
            {
                console.log('test2', event.target)
                console.log('test3', event.data)
            })
            // and here after the call hind got to do something 
        }),
    },
    user :
    {
        getProfileInfos : (id) => new Promise (resolve => {
            generatedHttpRequests.createGetRequest(ENDPOINTS.PROFILE + id)(resolve)
        }),
        getUsers : (query) => new Promise (resolve => {
            generatedHttpRequests.createGetRequest(ENDPOINTS.SEARCHED_USERS)(resolve, {key : 'search', value : query})
        }),
    },
    friendship :
    {
        postFriendship : (action, id) => new Promise (resolve => 
        {
            const messageIdentifier = action.replace('_',' the ')
            // console.log('here : ', messageIdentifier)
            generatedHttpRequests.createPostRequest(`${ENDPOINTS.FRIENDSHIP}${action}/${id}`, {needsAuth : true, modalMessage: `you did ${messageIdentifier} successfully`})(null, resolve)
        }),
        deleteFriendship : (action, id) => new Promise (resolve => 
        {
            const messageIdentifier = action.replace('_',' the ')
            console.log('here : ', messageIdentifier)
            generatedHttpRequests.createDeleteRequest(`${ENDPOINTS.FRIENDSHIP}${action}/${id}`, `you did ${messageIdentifier} successfully`)(resolve)
        }),
    },
    // home :
    // {
    //     getLeaderboardData :  () => new Promise (resolve => 
    //     {
    //         generatedHttpRequests.createGetRequest(ENDPOINTS.LEADERBOARD, {needsAuth : false, modalMessage: null})(body, resolve)
    //     })
    // }
}