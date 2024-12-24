class RequestConfiguration
{
    constructor()
    {
        this._config = 
        {
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

const generateHttpRequests = () =>
({
    createPostRequest(endpoint, options = {})
    {
        return(body) => {
            const request = new RequestConfiguration()
                .withMethod('POST')
                .withBody(body)

            console.log(Object.entries(options).length)
            if (Object.entries(options))
                request.withAuth(options.needsAuth).withModal(options.modalMessage)
                        
            console.log('request  : ', request)
        }
    }
})

const generatedHttpRequests = generateHttpRequests()

generatedHttpRequests.createPostRequest('endpoint OF SIGNUP', {needsAuth :  false, modalMessage : 'welcome to pingyyy !!!'})({username : 'john', password : 'test'}) // lets say here we are sign in
