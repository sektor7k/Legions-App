
interface TCardProps{
    
}
export default function TCard() {

    return (
        <div  className="h-16 w-32 bg-red-800 bg-opacity-50 border-2 border-red-800 backdrop-blur-sm rounded-sm relative with-connector grid grid-cols-3">
            <div className=" col-span-2 flex flex-col items-center justify-center">
                <img src="https://futesports.gg/wp-content/uploads/2021/05/Crest-White_1@3x-300x300.png" alt="" width={42} />
                <p className="text-xs font-bold">Team 1</p>
            </div>
            <div className="col-span-1 border-l-2 border-gray-800 flex items-center justify-center ">
                <p className="text-3xl font-bold">2</p>
            </div>
           
        </div>
    )
}