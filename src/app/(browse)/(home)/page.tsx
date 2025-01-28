
import FeatureCards from "./_components/OurProduct";
import CryptoGainLoseTables from "./_components/TopGainLose";
import { TournamentCards } from "./_components/TournamentCards";
import Trending from "./_components/Trending";

export default function HomePage(){
    

    return(
        <div className="min-h-screen">
      <Trending direction="left" speed="normal" pauseOnHover={true} />
      <CryptoGainLoseTables/>
      <TournamentCards/>
      <FeatureCards/>
    
    </div>
            
        
    )
}