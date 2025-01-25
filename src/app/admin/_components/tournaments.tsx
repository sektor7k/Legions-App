"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

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
  status: "open" | "closed"
}

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
  status,
}: TournamentsCardProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(status)

  const handleStatusChange = async (newStatus: "open" | "closed") => {
    try {
      await axios.post("/api/admin/tournament/editstatus", {
        id,
        status: newStatus,
      })
      setCurrentStatus(newStatus)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to update tournament status:", error)
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="capitalize">
              {currentStatus}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tournament Status</DialogTitle>
            </DialogHeader>
            <Select onValueChange={(value: "open" | "closed") => handleStatusChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>
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
    </TableRow>
  )
}

