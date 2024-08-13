
import BrowseHeader from '@/components/layout/BrowseHeader';


const BrowseLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div  >
            <BrowseHeader/>

            {children}

        </div>
    );
};

export default BrowseLayout;