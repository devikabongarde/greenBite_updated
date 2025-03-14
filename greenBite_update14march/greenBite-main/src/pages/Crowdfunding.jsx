import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"

import React, { useState, useEffect } from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, Share2, DollarSign } from 'lucide-react'


const initialCampaigns = [
  {
    id: 1,
    title: "Save the Local Theater",
    description: "Help us renovate our historic theater and keep the arts alive in our community.",
    goal: 50000,
    raised: 32000,
    daysLeft: 15,
    backers: 256,
    creator: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=40&width=40" }
  },
  {
    id: 2,
    title: "Green Energy for Schools",
    description: "Install solar panels in local schools to reduce energy costs and teach sustainability.",
    goal: 75000,
    raised: 51000,
    daysLeft: 30,
    backers: 412,
    creator: { name: "Michael Chen", avatar: "/placeholder.svg?height=40&width=40" }
  },
  {
    id: 3,
    title: "Community Garden Project",
    description: "Create a community garden to provide fresh produce and educate about sustainable farming.",
    goal: 20000,
    raised: 8000,
    daysLeft: 45,
    backers: 103,
    creator: { name: "Emily Rodriguez", avatar: "/placeholder.svg?height=40&width=40" }
  }
]
function Crowdfunding() {


const [campaigns, setCampaigns] = useState(initialCampaigns)
const [newCampaign, setNewCampaign] = useState({ title: '', description: '', goal: '' })
const [selectedCampaign, setSelectedCampaign] = useState(null)
const [donationAmount, setDonationAmount] = useState('')

const handleCreateCampaign = (e) => {
  e.preventDefault()
  const campaign = {
    id: campaigns.length + 1,
    ...newCampaign,
    goal: parseFloat(newCampaign.goal),
    raised: 0,
    daysLeft: 30,
    backers: 0,
    creator: { name: "Anonymous", avatar: "/placeholder.svg?height=40&width=40" }
  }
  setCampaigns([...campaigns, campaign])
  setNewCampaign({ title: '', description: '', goal: '' })
}

const handleDonate = (campaignId) => {
  const amount = parseFloat(donationAmount)
  if (isNaN(amount) || amount <= 0) return

  setCampaigns(campaigns.map(campaign => 
    campaign.id === campaignId
      ? { ...campaign, raised: campaign.raised + amount, backers: campaign.backers + 1 }
      : campaign
  ))
  setDonationAmount('')
  setSelectedCampaign(null)
}
return (
  <SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
          <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Crowd Funding
              </BreadcrumbLink>
            </BreadcrumbItem>
            

          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

    <div className="container mx-auto p-4 max-w-6xl">
    <h1 className="text-3xl font-bold mb-8 text-center">Crowdfunding Platform</h1>

    <Tabs defaultValue="browse" className="mb-8">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="browse">Browse Campaigns</TabsTrigger>
        <TabsTrigger value="create">Create Campaign</TabsTrigger>
      </TabsList>
      <TabsContent value="browse">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={(campaign.raised / campaign.goal) * 100} className="mb-2" />
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>${campaign.raised.toLocaleString()} raised</span>
                  <span>${campaign.goal.toLocaleString()} goal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{campaign.backers} backers</span>
                  <span>{campaign.daysLeft} days left</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={campaign.creator.avatar} alt={campaign.creator.name} />
                    <AvatarFallback>{campaign.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{campaign.creator.name}</span>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Donate</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Donate to {campaign.title}</DialogTitle>
                        <DialogDescription>Enter the amount you wish to donate.</DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="text-muted-foreground" />
                        <Input 
                          type="number" 
                          placeholder="Amount" 
                          value={donationAmount} 
                          onChange={(e) => setDonationAmount(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => handleDonate(campaign.id)}>Confirm Donation</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Like</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Campaign</CardTitle>
            <CardDescription>Fill out the form below to start your crowdfunding campaign.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <Label htmlFor="title">Campaign Title</Label>
                <Input 
                  id="title" 
                  value={newCampaign.title} 
                  onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newCampaign.description} 
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="goal">Funding Goal ($)</Label>
                <Input 
                  id="goal" 
                  type="number" 
                  value={newCampaign.goal} 
                  onChange={(e) => setNewCampaign({...newCampaign, goal: e.target.value})} 
                  required 
                />
              </div>
              <Button type="submit">Create Campaign</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
      
    </div>
  </SidebarInset>
</SidebarProvider>
)
}

export default Crowdfunding