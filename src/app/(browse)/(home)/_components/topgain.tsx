import Image from "next/image";
export default function TopGain() {
    const topGainData = [
        { name: 'Netvrk', symbol: 'NETVR', price: '$0.07257', change: '13.64%', volume: '$317.9K' },
        { name: 'Netvrk', symbol: 'NETVR', price: '$0.07257', change: '13.64%', volume: '$317.9K' },
        { name: 'Netvrk', symbol: 'NETVR', price: '$0.07257', change: '13.64%', volume: '$317.9K' },
        { name: 'Netvrk', symbol: 'NETVR', price: '$0.07257', change: '13.64%', volume: '$317.9K' },
        { name: 'Netvrk', symbol: 'NETVR', price: '$0.07257', change: '13.64%', volume: '$317.9K' },
        { name: 'Netvrk', symbol: 'NETVR', price: '$0.07257', change: '13.64%', volume: '$317.9K' },
    ];

    return (
        <div className="bg-black p-4 bg-opacity-50 backdrop-blur-md border-gradient">
            <h2 className="text-white text-xl font-bold mb-4 text-center">TOP GAIN</h2>
            <table className="w-full text-white">
                <thead className="border-gradient-bottom">
                    <tr>
                        <th className="text-left w-1/2">Game</th>
                        <th className="text-left w-1/6">Price</th>
                        <th className="text-left w-1/6 text-red-400">%24h</th>
                        <th className="text-left w-1/6">Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {topGainData.map((item, index) => (
                        <tr key={index} className=" border-gray-800 border-gradient-bottom font-bold h-20">
                            <td className="py-3 flex items-center w-1/2">
                                <Image src={"/coin1.jpg"} width={32} height={32} alt={item.name} className="mr-2" />
                                <div>
                                    <p>{item.name}</p>
                                    <p className="text-red-500">{item.symbol}</p>
                                </div>
                            </td>
                            <td className="w-1/6">{item.price}</td>
                            <td className="text-green-600 w-1/6">{item.change}</td>
                            <td className="w-1/6">{item.volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center ">
                <button className="flex items-center px-4 text-white hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-9">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                    </svg>

                </button>
            </div>
        </div>
    );
}
