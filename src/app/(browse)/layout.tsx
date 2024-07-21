import Navbar from "./_components/navbar";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div >
            <Navbar />

            {children}

        </div>
    );
};

export default BrowseLayout;