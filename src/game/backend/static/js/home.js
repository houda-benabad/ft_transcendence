import * as INVITE from './game.js'
import * as MULTI from './multiPlayer.js'
import * as TOUR from './tournament.js'
import * as LOCAL from './local.js'
import * as RPS from './rps.js'

let vs = document.getElementById('VS')
let multi = document.getElementById('MULTI')
let local = document.getElementById('LOCAL')
let tour = document.getElementById('TOUR')
let rps = document.getElementById('RPS')

vs.addEventListener('click', (e) => {
    e.preventDefault()
    vs.remove()
    multi.remove()
    local.remove()
    tour.remove()
    rps.remove()

    INVITE.start('game')
})


multi.addEventListener('click', (e) => {
    e.preventDefault()
    vs.remove()
    multi.remove()
    local.remove()
    tour.remove()
    rps.remove()

    INVITE.start('multi')
})


tour.addEventListener('click', (e) => {
    e.preventDefault()
    vs.remove()
    multi.remove()
    local.remove()
    tour.remove()
    rps.remove()
    console.log("CLOCKED")
    TOUR.create_form()
})

// rps.addEventListener('click', (e) => {
//     e.preventDefault()
//     vs.remove()
//     multi.remove()
//     local.remove()
//     tour.remove()
//     rps.remove()

//     RPS.start()
// })

// local.addEventListener('click', (e) => {
//     e.preventDefault()
//     vs.remove()
//     multi.remove()
//     local.remove()
//     tour.remove()
//     rps.remove()

//     LOCAL.start()
// })