"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface Coin {
  id: string
  symbol: string
  name: string
  image: string
}

export default function TrendCoinSelector() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [selectedCoins, setSelectedCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://pro-api.coingecko.com/api/v3/coins/markets",
          params: { vs_currency: "usd", category: "gaming" },
          headers: { accept: "application/json", "x-cg-pro-api-key": process.env.NEXT_PUBLIC_GECKO_API },
        }
        const response = await axios.request(options)
        setCoins(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching coins:", error)
        setLoading(false)
      }
    }

    fetchCoins()
  }, [])

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

  const handleAddToken = (coinId: string) => {
    const coinToAdd = coins.find((coin) => coin.id === coinId)
    if (coinToAdd && !selectedCoins.some((coin) => coin.id === coinId)) {
      setSelectedCoins([...selectedCoins, coinToAdd])
    }
    setOpen(false)
  }

  const handleRemoveToken = (coinId: string) => {
    setSelectedCoins(selectedCoins.filter((coin) => coin.id !== coinId))
  }

  const handleSubmitTokens = async () => {
    try {
      const tokenIds = selectedCoins.map((coin) => coin.id)
      await axios.post("/api/admin/trending", { tokenIds })
      showToast("Tokens added successfully!")
    } catch (error) {
      console.error("Error submitting tokens:", error)
      showErrorToast("Error submitting tokens")
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Trend Coin</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                Select a coin...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search coin..." />
                <CommandList>
                  <CommandEmpty>No coin found.</CommandEmpty>
                  <CommandGroup>
                    {coins.map((coin) => (
                      <CommandItem key={coin.id} onSelect={() => handleAddToken(coin.id)}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCoins.some((c) => c.id === coin.id) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6 mr-2" />
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {selectedCoins.map((coin) => (
          <Card key={coin.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-10 h-10 mr-3" />
                <div>
                  <h3 className="font-semibold">{coin.name}</h3>
                  <p className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveToken(coin.id)}>
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmitTokens} disabled={selectedCoins.length === 0}>
        Add Tokens
      </Button>
    </div>
  )
}

