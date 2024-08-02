
import Navbar from '@/components/layout/navbar';


const BrowseLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div  >
            <Navbar/>

            {children}

        </div>
    );
};

export default BrowseLayout;