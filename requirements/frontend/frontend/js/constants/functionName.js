import { eventHandlers } from "../utils/eventHandlers.js"

//this is not maintenable and not clean
export const FUNCTIONNAME =
{
    PLAY_GAME : (event) => eventHandlers.home.playGame(event),
    MODE : (event, mode) => eventHandlers.game.slider(event, mode),
    ROUTER: (event, e) => eventHandlers.router.anchorsNavHandler(event, e),
    UPDATE_IMAGE : () => eventHandlers.settings.updateImage,
    DELETE_IMAGE : () => eventHandlers.settings.deleteImage,
    SAVE_USERNAME : () => eventHandlers.settings.saveUsername,
    ADD_PASSWORD : () => eventHandlers.settings.addPassword,
    TWO_FA : () => eventHandlers.settings.twofa,
    DELETE_ACCOUNT : () => eventHandlers.settings.deleteAccount,
    GAME_FORM : (event, resolve) => eventHandlers.form.gameFormHandler(event, resolve)
}