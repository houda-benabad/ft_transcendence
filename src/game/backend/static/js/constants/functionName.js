import { eventHandlers } from "../utils/eventHandlers.js"

export const FUNCTIONNAME =
{
    TOURNAMENT : eventHandlers.home.tournament,
    LOCAL : eventHandlers.home.local,
    REMOTE : eventHandlers.home.remote,
    MULTIPLAYER : eventHandlers.home.multiplayer,
    MODE : (event, mode) => eventHandlers.game.slider(event, mode),
    ROUTER: (event, e) => eventHandlers.router.anchorsNavHandler(event, e),
    UPDATE_IMAGE : eventHandlers.settings.updateImage,
    DELETE_IMAGE : eventHandlers.settings.deleteImage,
    SAVE_USERNAME : eventHandlers.settings.saveUsername,
    ADD_PASSWORD : eventHandlers.settings.addPassword,
    TWO_FA : eventHandlers.settings.twofa,
    DELETE_ACCOUNT : eventHandlers.settings.deleteAccount,
    GAME_FORM : (event, resolve) => eventHandlers.form.gameFormHandler(event, resolve)
}