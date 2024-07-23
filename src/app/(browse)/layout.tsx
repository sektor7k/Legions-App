import Header from '@/components/layout/header';


const BrowseLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div >
            <Header />

            {children}

        </div>
    );
};

export default BrowseLayout;