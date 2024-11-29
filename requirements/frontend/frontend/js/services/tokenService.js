export class tokenService
{
    constructor()
    {
        this._token = localStorage.getItem('authToken')
    }
    set token(newToken)
    {
        this._token = newToken
        localStorage.setItem('authToken', newToken)
    }
    get token()
    {
        return (this._token)
    }
    isAuthenticated()
    {
        return(this._token ? true : false)
    }
    clearToken()
    {
        this._token = null
        localStorage.removeItem('authToken')
    }
}