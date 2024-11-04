import BetHeader from "./_components/BetHeader";


const BetLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div>
            <BetHeader/>
            {children}
        </div>
    );
};
export default BetLayout;