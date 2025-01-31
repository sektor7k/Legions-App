"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, X } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios"
import useSWR from "swr"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TournamentsCardProps {
  id: string
  name: string
  thumbnail: string
  thumbnailGif: string
  organizer: string
  organizerAvatar: string
  participants: number
  capacity: number
  date: string
  tournamentStatus: string
  moderators: []
}

interface UserProps {
  _id: string
  username: string
  image: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export function Tournaments({
  id,
  name,
  thumbnail,
  thumbnailGif,
  organizer,
  organizerAvatar,
  participants,
  capacity,
  date,
  tournamentStatus,
  moderators,
}: TournamentsCardProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [moderator, setModerators] = useState<UserProps[]>(moderators)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: users = [], error } = useSWR<UserProps[]>("/api/admin/user/getUser", fetcher)
  

  const filteredUsers = users.filter((user) => user.username?.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddModerator = (user: UserProps) => {
    if (!moderator.some((mod) => mod._id === user._id)) {
      setModerators([...moderator, user])
    }
  }

  const handleRemoveModerator = (userId: string) => {
    setModerators(moderator.filter((mod) => mod._id !== userId))
  }

  const handleSaveModerators = async () => {
    try {
      const moderatorIds = moderator.map((mod) => mod._id)
      console.log(moderatorIds, id)
       await axios.post("/api/admin/tournament/addModerator", { id, moderatorIds })
       setIsOpen(false)
    } catch (error) {
      console.error("Error saving moderators:", error)
    }
  }

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={thumbnail || "/placeholder.svg"}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        <Button variant="outline" className="capitalize" disabled>
          {tournamentStatus}
        </Button>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {participants}/{capacity}
      </TableCell>
      <TableCell className="hidden md:table-cell">{date}</TableCell>
      <TableCell>
        <Button
          aria-haspopup="true"
          size="icon"
          variant="ghost"
          onClick={() => router.push(`/admin/edittournament/${id}`)}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Button onClick={() => setIsOpen(true)}>Moderators</Button>
      </TableCell>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-inherit">
          <DialogHeader>
            <DialogTitle>Manage Moderators</DialogTitle>
          </DialogHeader>
          <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="max-h-60 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleAddModerator(user)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.username} />
                    <AvatarFallback>{user.username?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span>{user.username}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Selected Moderators:</h3>
            {moderator.map((mod) => (
              <div key={mod._id} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={mod.image} alt={mod.username} />
                    <AvatarFallback>{mod.username?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span>{mod.username}</span>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleRemoveModerator(mod._id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveModerators}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TableRow>
  )
}

