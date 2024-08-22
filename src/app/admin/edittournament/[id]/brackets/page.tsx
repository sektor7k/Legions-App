import TCard from "./_components/Cards";

export default function Page() {
    return (
        <div className="flex  items-center mt-14 pl-10">
            <div className="flex flex-row justify-center mr-3">
                <ol className="flex flex-1 flex-col justify-around mr-20 space-y-2 round">
                    {/* Round 1 */}
                    {Array(16).fill(0).map((_, index) => (
                        <TCard key={index}/>
                    ))}
                </ol>
                <ol className="flex flex-1 flex-col justify-around mr-20 ml-10 round">
                    {/* Round 2 */}
                    {Array(8).fill(0).map((_, index) => (
                        <TCard key={index}/>
                    ))}
                </ol>
                <ol className="flex flex-1 flex-col justify-around mr-20 ml-10 round">
                    {/* Round 3 */}
                    {Array(4).fill(0).map((_, index) => (
                       <TCard key={index}/>
                    ))}
                </ol>
                <ol className="flex flex-1 flex-col justify-around mr-20 ml-10 round">
                    {/* Round 4 */}
                    {Array(2).fill(0).map((_, index) => (
                        <TCard key={index}/>
                    ))}
                </ol>
                <ol className="flex flex-1 flex-col justify-around mr-20 ml-10 round round-winner">
                    {/*kazanan */}
                    {Array(1).fill(0).map((_, index) => (
                        <TCard key={index}/>
                    ))}
                </ol>
            </div>
        </div>
    );
}
