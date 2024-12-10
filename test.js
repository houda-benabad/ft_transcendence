
function handleSearch(event) {
	event.preventDefault()

	let formData = new FormData(searchForm)
	let data = Object.fromEntries(formData)
	let searchParams = new URLSearchParams(data)
	const endpoint = `${baseEndPoint}/search/?${searchParams}`
	
	const headers= {
			"Content-Type": "application/json"
		}
	const authToken = localStorage.getItem('access')
	if (authToken){
		headers['Authorization'] = `Bearer ${authToken}`
	}
	const options = {
		method: "GET",
		headers: headers
	}
	fetch(endpoint, options) // promise
	.then(response=>{
		return response.json()
	})
	.then(data =>{
		// console.log(data.hits)
		// writeToContainer(data)
		const validData = isTokenNotValid(data)
		if (validData && contentContainer){
			contentContainer.innerHTML = ""
			if (data && data.hits){
				let htmlStr = ""
				for (let result of data.hits) {
					htmlStr += "<li>" + result.title + "</li>"
				}
				contentContainer.innerHTML = htmlStr
				if (data.hits.length == 0) {
					contentContainer.innerHTML = "<p>No 1 results found</p>"
				}
			} else {
				contentContainer.innerHTML = "<p>No 1 results found</p>"
			}
		}
	})
	.catch(err=> {
		console.log("err", err)
	})
}

function handleAuthData(authData, callback) {
	localStorage.setItem('access', authData.access)
	localStorage.setItem('refresh', authData.refresh)
	if (callback) {
		callback()
	}
}

function writeToContainer(data) {
	if (contentContainer){
		contentContainer.innerHTML = "<pre>" + JSON.stringify(data, null, 4) + "</pre>"
	}
}

function getFetchOptions(method, body){
	return {
		method: method==null ? "GET": method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${localStorage.getItem('access')}`
		},
		body: body ? body : null
	}
}

function validateJWTToken(){
	// fetch
	const endpoint = `${baseEndPoint}/token/verify/`
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			token: localStorage.getItem('access')
		})
	}
	fetch(endpoint, options)
	.then(response=>response.json())
	.then(x=>{
		// refresh token