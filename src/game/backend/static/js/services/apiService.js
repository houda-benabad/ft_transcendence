import {ENDPOINTS} from '../constants/endpoints.js'
import { modalService } from './modalService.js'

const serverIp = 'https://8b89b413-0cc1-4252-92aa-2ac6c60c1be4.mock.pstmn.io/'

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
            if (!response.ok && response.status === 500)
                throw new Error(response.status)
            else if (response.ok)
                resolve()
            const message = await response.json()

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
            return apiService.fetchApi(serverIp + ENDPOINTS.SIGN_IN, {
                method: 'POST',
                body: JSON.stringify(userInfos)
            })
        },
        signup(userInfos)
        {
            return apiService.fetchApi(serverIp + ENDPOINTS.SIGN_UP, {
                method: 'POST',
                body: JSON.stringify(userInfos)
            })
        },
        intra() {return (apiService.fetchApi(serverIp + ENDPOINTS.INTRA))}
    }
}