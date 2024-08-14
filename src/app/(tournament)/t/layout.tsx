import TournamentHeader from '@/components/layout/TournamentHeader';


const TournamentLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div  >
            <TournamentHeader />
            <div className="relative flex h-screen overflow-hidden">
                <main className="flex-1 pt-14 pb-14 relative overflow-y-auto ">
                    <div className="fixed inset-0 bg-bg-tournament bg-cover bg-center h-full"></div>
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );  
};

export default TournamentLayout;