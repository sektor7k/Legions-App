import BetHeader from "./_components/BetHeader";


const BetLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="bg-[#080812] min-h-screen">
            <BetHeader/>
            {children}
        </div>
    );
};
export default BetLayout;