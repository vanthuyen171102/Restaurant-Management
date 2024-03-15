import React from 'react'
import DinnerTable from '../components/DinnerTable'

export default function Tables() {
    return (
        <>
            <div class="grid grid-cols-4 gap-4 rounded-lg text-center font-mono text-sm font-bold leading-6 text-white">
            <DinnerTable name={"Bàn 1"} id="1" status={'empty'}/>
                <DinnerTable name={"Bàn 2"} id="2" status={'in-use'}/>
                <DinnerTable name={"Bàn 3"} id="3" status={'empty'}/>
                <DinnerTable name={"Bàn 4"} id="4" status={'empty'} />
                <DinnerTable name={"Bàn 5"} id="5" status={'empty'}/>
            </div>
        </>
    )
}
