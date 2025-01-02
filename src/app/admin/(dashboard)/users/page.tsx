"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Search, UserPlus, XIcon, DiscIcon as Discord, MessageCircle, Wallet } from 'lucide-react'
import axios from "axios"
import useSWR from "swr"
import { toast } from "@/components/ui/use-toast"


interface UserProps {
  _id: string;
  username?: string;
  email?: string;
  role: string;
  status: string;
  image: string;
  socialMedia: {
    twitter: string;
    discord: string;
    telegram: string;
  }
  wallets: {
    evm: string;
    solana: string;
  }
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function AdminUserList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserProps>()
  const [editingRole, setEditingRole] = useState("")

  const { data: users = [], error, mutate } = useSWR<UserProps[]>('/api/admin/user/getUser', fetcher);

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function showErrorToast(message: string): void {
    toast({
      variant: "destructive",
      title: message,
      description: "",
    })
  }

  function showToast(message: string): void {
    toast({
      variant: "default",
      title: message,
      description: "",
    })
  }

  const handleRoleChange = async (userId: string, newRole: string) => {

    try {
      const response = await axios.post('/api/admin/user/editUserRole', { id: userId, role: newRole });
      await mutate();
      showToast("User role successfully changed")
    } catch (error: any) {
      showErrorToast(error.response.message)
      console.error("User edit role error", error);
    }
  }

  const handleBlockUser = async (userId: string, newStatus: string) => {
    try {
      
      const response = await axios.post('/api/admin/user/editUserStatus', { id: userId, status: newStatus })
      await mutate();
      showToast("User status successfully changed")
    } catch (error: any) {
      showErrorToast(error.response.message)
      console.error("User status role error", error);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Manager</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search user..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>


      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.username} />
                    <AvatarFallback>{user.username?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                        Detail
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl bg-inherit">
                      <DialogHeader>
                        <DialogTitle>User Detail</DialogTitle>
                      </DialogHeader>
                      {selectedUser && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Profile Detail</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-4">
                              <Avatar className="w-32 h-32">
                                <AvatarImage src={selectedUser.image} alt={selectedUser.username} />
                                <AvatarFallback>{selectedUser.username?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="text-center">
                                <h3 className="text-2xl font-bold">{selectedUser.username}</h3>
                                <p className="text-muted-foreground">{selectedUser.email}</p>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">Role:</span>
                                  <Select onValueChange={(value) => setEditingRole(value)} defaultValue={selectedUser.role}>
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder={selectedUser.role} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="moderator">Moderator</SelectItem>
                                      <SelectItem value="user">User</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button variant="outline" size="sm" onClick={() => handleRoleChange(user._id, editingRole)}>
                                    Save
                                  </Button>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">Status:</span>
                                  <Button
                                    variant={user.status === "active" ? "outline" : "destructive"}
                                    size="sm"
                                    onClick={() => handleBlockUser(user._id, user.status)}
                                  >
                                    {user.status === "active" ? 'User Actived ' : 'User Blocked'}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <XIcon className="h-5 w-5 text-blue-400" />
                                <Label>Twitter:</Label>
                                <span>{selectedUser.socialMedia.twitter}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Discord className="h-5 w-5 text-indigo-500" />
                                <Label>Discord:</Label>
                                <span>{selectedUser.socialMedia.discord}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MessageCircle className="h-5 w-5 text-blue-500" />
                                <Label>Telegram:</Label>
                                <span>{selectedUser.socialMedia.telegram}</span>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="md:col-span-2">
                            <CardHeader>
                              <CardTitle>Blockchain Addresses</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Wallet className="h-5 w-5 text-purple-500" />
                                <Label>EVM Address:</Label>
                                <span className="font-mono">{selectedUser.wallets.evm}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Wallet className="h-5 w-5 text-blue-500" />
                                <Label>Solana Address:</Label>
                                <span className="font-mono">{selectedUser.wallets.solana}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} users in total
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

