import { local } from "./local.js";
import { modalService } from "../services/modalService.js";


export async function tournament( options, players ) {
    return new Promise(async (resolve) =>{

        const winners = []
        winners[0] = await local(  options, [players[0], players[1]]  )
        if( !winners[0])
            return resolve( false )
        await modalService.show(  `This round winner is ${winners[0]}` , true)
        winners[1] = await local(  options , [players[2], players[3]] )
        if( !winners[1])
            return resolve( false )
        await modalService.show(  `This round winner is ${winners[1]}` , true)
        const winner = await local(  options , winners )
        if( !winner)
            return resolve( false )
        await modalService.show(  `Winner is ${winner}` , true)
        return resolve( true )
    })
}