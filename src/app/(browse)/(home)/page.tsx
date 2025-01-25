
import CryptoGainLoseTables from "./_components/TopGainLose";
import Trending from "./_components/Trending";

export default function HomePage(){
    

    return(
        <div className="min-h-screen">
      <Trending direction="left" speed="normal" pauseOnHover={true} />
      <CryptoGainLoseTables/>
    
    </div>
            
        
    )
}