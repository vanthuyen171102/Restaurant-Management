import DinnerTable from './DinnerTable'
import FoodCard from './FoodCard'

export default function MenuGrid() {
    return (
        <>
            <div className="grid grid-cols-3 gap-3 pb-3 rounded-lg text-center font-mono text-sm font-bold leading-6 text-white">
                <FoodCard />
                <FoodCard />
                <FoodCard />
                <FoodCard />
                <FoodCard />
                <FoodCard />
                <FoodCard />
            </div>
        </>
    )
}
