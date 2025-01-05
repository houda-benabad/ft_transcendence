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
            modalMessage : 'default modal message',
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
            showModal, 
            modalMessage,
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
            if (needsAuth && response.status === 401)
                await this.manageExpiredTokens()
            if (response.status === 500)
                throw new Error(response.status)
            const contentType = response.headers.get('Content-Type');
            if (!contentType)
                return this._resolve()

            const responseBody = await response.json()
            if (!response.ok)
                modalMessage = this.updateModalMessaga(responseBody)
            else 
                this._resolve(responseBody)
            if (showModal)
                await modalService.show(modalMessage)
        }
        catch(error)
        {
            console.log('the error that was caught in api service is ', error)
        }
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
            console.log('->>>>>> refresh token was expired')
            _tokenService.clear()
            document.getElementById('app').classList.remove('active')
            router.handleRoute('/signin')
            this._resolve()
        }
        console.log('im in here doing some work')
        const responseBody = await response.json()
        _tokenService.accessToken = responseBody.access
        this.request()
        this._resolve 
    }    
    updateModalMessaga(responseBody)
    {
        const entries = Object.entries(responseBody)
        const [key, value] = entries[0]

        return `${key} : ${value}`
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
    createGetRequest(endpoint, modalMessage = null)
    {
        return (resolve, params = null) => 
        {
            const request = new RequestConfiguration()
                .withEndpoint(endpoint)
            if (modalMessage)
                request.withModal(modalMessage)
            else if (params)
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
        })
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
        postFriendship : (action, userId) => new Promise (resolve => 
        {
            generatedHttpRequests.createPostRequest(`${ENDPOINTS.FRIENDSHIP}${action}/${userId}`, {needsAuth : true, modalMessage: `the operation was successfull`})(null, resolve)
        }),
        deleteFriendship : (action, userId) => new Promise (resolve => 
        {
            generatedHttpRequests.createDeleteRequest(`${ENDPOINTS.FRIENDSHIP}${action}/${userId}`, {needsAuth : true, modalMessage: `the operation was successfull`})(resolve)
        }),
    },
    jwt : 
    {
        refreshToken : (body) => new Promise (resolve => 
        {
            generatedHttpRequests.createPostRequest(ENDPOINTS.REFRESH_TOKEN, {needsAuth : false, modalMessage: null})(body, resolve)
        }),// gotta use it to make code simplified but ..
    },
    // home :
    // {
    //     getLeaderboardData :  () => new Promise (resolve => 
    //     {
    //         generatedHttpRequests.createGetRequest(ENDPOINTS.LEADERBOARD, {needsAuth : false, modalMessage: null})(body, resolve)
    //     })
    // }
}