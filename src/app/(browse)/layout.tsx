
import BrowseHeader from '@/components/layout/BrowseHeader';
import Navbar from '@/components/layout/navbar';


const BrowseLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div  >
            <BrowseHeader/>

            {children}

        </div>
    );
};

export default BrowseLayout;