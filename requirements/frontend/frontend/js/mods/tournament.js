import { local } from "./local.js";
import { modalService } from "../services/modalService.js";


export async function tournament( options, players ) {

        const winners = []
        const losers = []

        console.log( players )
        for ( let i=0; i < players.length; i+= 2){
            await modalService.show(  `This round ${players[i]} vs ${players[i+1]}` , false)
            let winner = await local( options, [players[i], players[i+1]])
            if ( !winner ) return  false 
            winners.push( winner )
            losers.push( players[i] == winner ? players[i+1]: players[i])
            await modalService.show(  `This round winner is ${winner}` , false)
        }

        await modalService.show(  `third place round ${losers[0]} vs ${losers[1]}` , false)
        const third_place = await local( options, losers )
        await modalService.show(  `This round winner is ${third_place}` , false)



        await modalService.show(  `final round ${winners[0]} vs ${winners[1]}` , false)
        const first_place = await local( options, winners)
        if (!first_place) return false;
        const second_place = winners[0] == first_place ? winners[1] : winners[0]


            await modalService.show(  `
                <div class="rank">
                   
                    <h2 class="secondPlace_title">
                        <br> 🥈  ${first_place}
                    </h2>
                    <h2 class="firstPlace_title">
                        🏆 ${second_place} 
                    </h2>
                    <h2 class="thirdPlace_title">
                        <br> 🥉 ${third_place}
                    </h2>
                    <div class="secondPlace"></div>
                    <div class="firstPlace"></div>
                    <div class="thirdPlace"></div>
                </div>
                ` , false)
        return true

}