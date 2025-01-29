import { local } from "./local.js";
import { modalService } from "../services/modalService.js";


export async function tournament( options ) {
    let firstWinner, secondWinner, winner;
        await local( options )
        console.log( 'FIRST ROUND DONE' )
        await modalService.show( "first round finished")
        await local( options )
        console.log( 'SECOND ROUND DONE' )

        await local( options )
        console.log( 'LAST ROUND DONE' )

}