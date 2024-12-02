import BetHeader from "./_components/BetHeader";


const BetLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className=" min-h-screen">
            <BetHeader/>
            {children}
        </div>
    );
};
export default BetLayout;