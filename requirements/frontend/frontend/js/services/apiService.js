import {ENDPOINTS} from '../constants/endpoints.js'
import { updateData } from '../utils/utils.js'
import { modalService } from './modalService.js'

const serverIp = 'http://localhost:8000/api/'

export const apiService = 
{ 
    async fetchApi (url, options = {})
    {
        return new Promise
        (async (resolve) => {
        try {
            const response = await fetch(url , {
                ...options,
                headers : {
                    "Content-Type": "application/json",
                    ...options.headers
                }
            })
            const responseBody = await response.json()
            const entries = Object.entries(responseBody)
            const [key , value] = entries[0]

            if (!response.ok && response.status === 500)
                throw new Error(response.status)
            else if (response.ok)
            {
                
                if(url === ENDPOINTS.SIGN_UP)
                {
                    await modalService.show('welcome to pingyyyyyy')
                    await new Promise(resolve => {setTimeout(resolve, 1500)})
                    document.getElementById('signDiv').dataset.value = 'Sign in'
                    updateData()
                    const modalBackground = document.getElementById('modal-background')

                    modalBackground.remove()
                }
                else if (url === ENDPOINTS.SIGN_IN)
                {
                    await modalService.show('you logged in successfully')
                    token = value
                    resolve (true)
                }
                return ;
            }
            const message = value[0]
            await modalService.show(message)
        }
        catch(error)
        {
            console.log(error)
        }
    })
    },
    auth : 
    {
        signin(userInfos)
        {
            return apiService.fetchApi(ENDPOINTS.SIGN_IN, {
                method: 'POST',
                body: JSON.stringify(userInfos)
            })
        },
        signup(userInfos)
        {
            return apiService.fetchApi(ENDPOINTS.SIGN_UP, {
                method: 'POST',
                body: JSON.stringify(userInfos)
            })
        },
        intra() {return (apiService.fetchApi(ENDPOINTS.INTRA))}
    },
    profile : 
    {
        getProfileInfos()
        {
            return apiService.fetchApi(ENDPOINTS.PROFILE, {
                method: 'GET',
                headers: 
                {
                    "Authorization": "mytoken",
                    // to add the authorization header for the token 
                },
                body: JSON.stringify(userInfos)
            })
        }
    }
}