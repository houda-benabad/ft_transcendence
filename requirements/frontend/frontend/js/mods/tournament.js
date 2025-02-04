import { local } from "./local.js";
import { modalService } from "../services/modalService.js";


export async function tournament( options ) {
    let firstWinner, secondWinner, winner;
        await local( options )
        await modalService.show( "first round finished")
        await local( options )

        await local( options )
}