import { useParams } from 'react-router-dom'
import BoxWrapper from '../components/BoxWrapper'
import FoodGrid from '../components/MenuGrid'

export default function TableOrdering() {

    const {id}  = useParams();

    console.log(id);
    return (
        <>
            <div className="flex items-start h-full gap-4">
                <div className="flex-auto w-3/4 h-full">
                    <FoodGrid />
                </div>

                <div className="flex-auto w-1/4 h-full">
                    <BoxWrapper/>
                </div>
            </div>
        </>
    )
}
