import { ENDPOINTS } from '../constants/endpoints.js'
import { modalService } from './modalService.js' // this one too need to find a solution for it
import { globalManager, tokenService } from '../managers/globalManager.js'
import { tokenExpired } from '../utils/utils.js'

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
        //  console.log('before : ', this._requestConfig)
        let {
            endpoint,
            method,
            needsAuth,
            body,
            params
        } = this._requestConfig

        console.log('here in apiService  : ', this._requestConfig)
        const url = params ? `${endpoint}?${params.key}=${encodeURIComponent(params.value)}` : endpoint
        try{
            const response = await fetch(url , {
                method,
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": needsAuth ? `Bearer ${tokenService.accessToken}` : null,
                },
                body : body ? JSON.stringify(body) : null
            })
            console.log('test response  , ', response)
            if (needsAuth && response.status === 401)
                tokenExpired(this.request.bind(this))
            if (response.status === 500)
                throw new Error(await response.json())
            else if (response.status === 404)
                this._resolve('not found')
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
            console.log('the error ', error)
        }
    }
    async finishingUp(response =  null)
    {
        const {showModal , modalMessage} = this._requestConfig

        if (showModal)
            await modalService.show(modalMessage, true)

        this._resolve(response)
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
    createPostRequest(endpoint, {needsAuth, modalMessage})
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
    createPutRequest(endpoint, {needsAuth, modalMessage})
    {
        return async (body, resolve) => {
            const request = new RequestConfiguration()
                .withEndpoint(endpoint)
                .withMethod('PUT')
                .withBody(body)
                .withAuth(needsAuth)

            if (modalMessage)
                request.withModal(modalMessage)        
            api.requestConfig = request.requestConfig
            api.resolve = resolve
            await api.request()
        }
    },
    createGetRequest(endpoint, {needsAuth, modalMessage})
    {
        return (resolve, params = null) => 
        {
            const request = new RequestConfiguration()
                .withEndpoint(endpoint)
                .withAuth(needsAuth)
            
            if (params)
                request.withParams(params)
            if (modalMessage)
                request.withModal(modalMessage)
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
            generatedHttpRequests.createPostRequest(ENDPOINTS.SIGN_UP, {needsAuth : false, modalMessage: 'you signed up successffully !!!'})(body, resolve)
        }),
        intraAuthorize :() => new Promise (async resolve => {
            generatedHttpRequests.createGetRequest(ENDPOINTS.INTRA_AUTHORIZE, {needsAuth : false, modalMessage: null})(resolve)
        }),
        intraCallback :  (body) => new Promise (resolve => 
        {
            generatedHttpRequests.createPostRequest(ENDPOINTS.INTRA_CALLBACK, {needsAuth : false, modalMessage: 'you logged in successfully with intra !!!'})(body, resolve)
        }),
    },
    user :
    {
        getProfileInfos : (id) => new Promise (resolve => {
            generatedHttpRequests.createGetRequest(ENDPOINTS.PROFILE + id, {needsAuth : true, modalMessage: null})(resolve)
        }),
        getUsers : (query) => new Promise (resolve => {
            generatedHttpRequests.createGetRequest(ENDPOINTS.SEARCHED_USERS, {needsAuth : true, modalMessage: null})(resolve, {key : 'search', value : query})
        }),
        getBasicDataOfUser : () => new Promise (async resolve => {
            generatedHttpRequests.createGetRequest(ENDPOINTS.USER_INFO, {needsAuth : true, modalMessage: null})(resolve)
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
            generatedHttpRequests.createDeleteRequest(`${ENDPOINTS.FRIENDSHIP}${action}/${id}`, `you did ${messageIdentifier} successfully`)(resolve)
        }),
    },
    home :
    {
        getLeaderboardData :  () => new Promise (resolve => 
        {
            generatedHttpRequests.createGetRequest(ENDPOINTS.LEADERBOARD, {needsAuth : false, modalMessage: null})(resolve)
        })
    },
    settings :
    {
        getBasicData : () => new Promise (async resolve => {
            generatedHttpRequests.createGetRequest(ENDPOINTS.SETTINGS_INFO, {needsAuth : true, modalMessage: null})(resolve)
        }),
        updateUsername : (body) => new Promise (resolve => 
        {
            generatedHttpRequests.createPutRequest(ENDPOINTS.SETTINGS_USERNAME_UPDATE, {needsAuth : true, modalMessage: 'updated the username successfully !!!'})(body, resolve)
        }),
        updatePassword : (body) => new Promise (resolve => 
        {
            generatedHttpRequests.createPostRequest(ENDPOINTS.SETTINGS_CHANGE_PASSWORD, {needsAuth : true, modalMessage: 'updated the password successfully !!!'})(body, resolve)
        }),
        updateImage : (body) => new Promise (resolve => 
        {
            generatedHttpRequests.createPutRequest(ENDPOINTS.SETTINGS_PIC_UPDATE, {needsAuth : true, modalMessage: 'updated the picture successfully !!!'})(body, resolve)
        }),
    }
}