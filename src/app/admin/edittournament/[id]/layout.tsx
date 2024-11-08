"use client"
import TournamentHeaderAdmin from '@/components/layout/TournamentHeaderAdmin';
import { useParams } from 'next/navigation';


const TournamentLayout = ({ children }: { children: React.ReactNode }) => {

    const params = useParams();
    const id = params.id as string;

    return (
        <div  >
            <TournamentHeaderAdmin id={id} />
            <div className="relative flex h-screen overflow-hidden">
                <main className="flex-1  relative overflow-y-auto ">
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