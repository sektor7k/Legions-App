import TopGain from "./topgain";
import TopLose from "./toplose";

export default function TopGainLose(){
    
    
      return (
        <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex flex-col justify-center items-center">
                <p className=" text-4xl font-extrabold border-gradient-bottom px-8 p-1"> TOP GAIN & LOSE</p>
                <p className=" text-gray-400 text-sm font-semibold" >Games with token price that has gained or lost the most in the last 24 hours</p>
            </div>
          <div className="grid grid-rows-2 gap-8 w-full max-w-7xl mt-6 lg:grid-cols-2">
            <TopGain/>
            <TopLose/>
          </div>
        </div>
      );
}