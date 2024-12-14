"use client"
import TournamentHeaderAdmin from '@/components/layout/TournamentHeaderAdmin';
import { useParams } from 'next/navigation';


const TournamentLayout = ({ children }: { children: React.ReactNode }) => {

    const params = useParams();
    const id = params.id as string;

    return (
        <div  >
            <TournamentHeaderAdmin id={id} />
            {children}

        </div>
    );
};

export default TournamentLayout;