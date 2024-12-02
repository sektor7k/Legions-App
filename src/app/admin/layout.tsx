import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <SidebarProvider>

            <div  >
                <div className="relative flex h-screen overflow-hidden">
                    <AppSidebar />
                    <main className="flex-1 pb-14 relative overflow-y-auto">


                        <div className="relative z-auto">

                            <SidebarTrigger />
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default AdminLayout;