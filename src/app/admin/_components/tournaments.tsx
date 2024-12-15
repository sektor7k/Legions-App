import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';

interface TournamentsCardProps {
  id: string;
  name: string;
  thumbnail: string;
  thumbnailGif: string;
  organizer: string;
  organizerAvatar: string;
  participants: number;
  capacity: number;
  date: string;
}

export function Tournamnets({
  id,
  name,
  thumbnail,
  thumbnailGif,
  organizer,
  organizerAvatar,
  participants,
  capacity,
  date }: TournamentsCardProps) {

  const router = useRouter()
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={thumbnail}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          Active
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{participants}/{capacity}</TableCell>
      <TableCell className="hidden md:table-cell">{date}</TableCell>

      <TableCell>
        <Button aria-haspopup="true" size="icon" variant="ghost" onClick={() => router.push(`/admin/edittournament/${id}`)}>
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
