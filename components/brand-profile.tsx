"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"

interface BrandProfileProps {
  onBrandProfileChange: (profile: any) => void
  initialBrandProfile: any
}

const CHANNEL_SUGGESTIONS = [
  "Digital Advertising",
  "Digital Publishing",
  "Event Activations",
  "News, Press, Media",
  "Outbound Sales",
  "Print Advertising",
  "Referrals & Partnerships",
  "Product Experience",
  "Retail",
  "Social Media",
]

export default function BrandProfile({ onBrandProfileChange, initialBrandProfile }: BrandProfileProps) {
  const [profile, setProfile] = useState(initialBrandProfile)
  const [newTeamMember, setNewTeamMember] = useState("")
  const [newSegment, setNewSegment] = useState("")
  const [newChannel, setNewChannel] = useState("")
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    onBrandProfileChange(profile)
  }, [profile, onBrandProfileChange])

  const addItem = (field: string, item: string) => {
    if (item.trim()) {
      setProfile((prev) => ({
        ...prev,
        [field]: [...prev[field], item.trim()],
      }))
    }
  }

  const removeItem = (field: string, item: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((i: string) => i !== item),
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
        setProfile((prev) => ({ ...prev, logo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="logo">Upload Logo (Black horizontal, preferred)</Label>
            <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
            {logo && (
              <div className="mt-2">
                <img src={logo || "/placeholder.svg"} alt="Brand Logo" className="max-h-20" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="totalBudget">Total Budget</Label>
            <Input
              id="totalBudget"
              type="number"
              value={profile.totalBudget}
              onChange={(e) => setProfile((prev) => ({ ...prev, totalBudget: Number(e.target.value) }))}
            />
          </div>

          {["personnel", "segments"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id={field}
                  value={field === "personnel" ? newTeamMember : newSegment}
                  onChange={(e) => {
                    if (field === "personnel") setNewTeamMember(e.target.value)
                    else setNewSegment(e.target.value)
                  }}
                  placeholder={`Add ${field.slice(0, -1)}`}
                />
                <Button
                  onClick={() => {
                    if (field === "personnel") {
                      addItem(field, newTeamMember)
                      setNewTeamMember("")
                    } else {
                      addItem(field, newSegment)
                      setNewSegment("")
                    }
                  }}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile[field].map((item: string) => (
                  <Badge key={item} variant="secondary">
                    {item}
                    <button onClick={() => removeItem(field, item)} className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ))}

          <div>
            <Label htmlFor="channels">Channels</Label>
            <div className="flex gap-2 mb-2">
              <Combobox
                options={CHANNEL_SUGGESTIONS}
                value={newChannel}
                onChange={setNewChannel}
                placeholder="Add channel"
              />
              <Button
                onClick={() => {
                  addItem("channels", newChannel)
                  setNewChannel("")
                }}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.channels.map((channel: string) => (
                <Badge key={channel} variant="secondary">
                  {channel}
                  <button onClick={() => removeItem("channels", channel)} className="ml-2 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="products">Products</Label>
            <Input
              id="products"
              value={profile.products}
              onChange={(e) => setProfile((prev) => ({ ...prev, products: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={profile.industry}
              onChange={(e) => setProfile((prev) => ({ ...prev, industry: e.target.value }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

