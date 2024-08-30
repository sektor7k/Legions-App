import TCard from "./_components/Cards";

const teamCount = 16;

export default function Page() {
    // Turları belirlemek için bir fonksiyon yazıyoruz
    const generateRounds = (teamCount:number) => {
        const rounds = [];
        let currentTeamCount = teamCount;

        while (currentTeamCount >= 2) {
            rounds.push(currentTeamCount);
            currentTeamCount = Math.floor(currentTeamCount / 2);
        }

        return rounds;
    };

    // Turların sayısını dinamik olarak belirliyoruz
    const rounds = generateRounds(teamCount);

    return (
        <div className="flex  items-center mt-10 pl-10 overflow-x-auto">
            <div className="flex flex-row justify-center mr-3">
                {rounds.map((teamsInRound, roundIndex) => (
                    <ol
                        key={roundIndex}
                        className="flex flex-1 flex-col justify-around mr-20 ml-10 round space-y-3"
                    >
                        {/* Her tur için dinamik olarak TCard'ları oluşturuyoruz */}
                        {Array(teamsInRound).fill(0).map((_, index) => (
                            <TCard key={index} />
                        ))}
                    </ol>
                ))}
                <ol className="flex flex-1 flex-col justify-around mr-20 ml-10 round round-winner">
                    {/* Kazanan */}
                    {Array(1).fill(0).map((_, index) => (
                        <TCard key={index} />
                    ))}
                </ol>
            </div>
        </div>
    );
}
