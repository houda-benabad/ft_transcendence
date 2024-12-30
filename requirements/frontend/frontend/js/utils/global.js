import { TokenService } from "../services/tokenService.js"
import { Router } from "../router/router.js"

const _tokenService = new TokenService()
const router = new Router()

export {_tokenService, router}
