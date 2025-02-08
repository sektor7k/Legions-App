"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TournamnetsTable } from '../_components/tournaments-table';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useSWR from 'swr';


const fetcher = (url: string) => axios.get(url).then((res) => res.data.tournaments)

export default function ProductsPage() {

  const router = useRouter(); 

  const { data: tournaments, error, mutate } = useSWR('api/admin/tournament/getAllTournament', (url) => fetcher(url));

  if (!tournaments) return <div>Loading...</div>;

  return (
    <div className='flex flex-col justify-center gap-6'>

      <div className="flex items-center">

        <div className="ml-auto ">

          <Button size="sm" className="h-8 gap-1" onClick={() => router.push("/admin/createTournament")}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Create Tornament
            </span>
          </Button>
        </div>
      </div>
      <TournamnetsTable offset={0} totalProducts={0} tournaments={tournaments} />
      
    </div>


  );
}
