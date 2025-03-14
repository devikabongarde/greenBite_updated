import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Star, TrendingUp, Zap, ShieldCheck, Truck } from 'lucide-react'

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
 


const achievements = [
    {
      id: 1,
      name: "Inventory Master",
      description: "Maintain 100% accurate inventory for 30 days",
      icon: <ShieldCheck className="h-6 w-6" />,
      progress: 75,
      completed: false,
    },
    {
      id: 2,
      name: "Efficiency Expert",
      description: "Process 1000 inventory transactions",
      icon: <Zap className="h-6 w-6" />,
      progress: 100,
      completed: true,
    },
    {
      id: 3,
      name: "Waste Reducer",
      description: "Reduce food waste by 20%",
      icon: <TrendingUp className="h-6 w-6" />,
      progress: 60,
      completed: false,
    },
    {
      id: 4,
      name: "Supply Chain Pro",
      description: "Establish relationships with 10 suppliers",
      icon: <Truck className="h-6 w-6" />,
      progress: 80,
      completed: false,
    },
  ]
  
  const badges = [
    { id: 1, name: "Novice", icon: <Star className="h-6 w-6 text-yellow-400" />, earned: true },
    { id: 2, name: "Intermediate", icon: <Star className="h-6 w-6 text-blue-400" />, earned: true },
    { id: 3, name: "Advanced", icon: <Star className="h-6 w-6 text-green-400" />, earned: false },
    { id: 4, name: "Expert", icon: <Star className="h-6 w-6 text-purple-400" />, earned: false },
    { id: 5, name: "Master", icon: <Star className="h-6 w-6 text-red-400" />, earned: false },
  ]
  
  function Achievements() {
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
                      Achievements
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Badges and Achievements</h1>
      
      <Tabs defaultValue="achievements">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Track your progress and unlock new achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full pr-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="mr-4 p-2 bg-primary rounded-full text-primary-foreground">
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.completed && (
                        <Badge variant="secondary" className="ml-auto">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <Progress value={achievement.progress} className="w-full" />
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>Showcase your expertise and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center p-4 border rounded-lg">
                    <div className={`mb-2 ${badge.earned ? '' : 'opacity-30'}`}>
                      {badge.icon}
                    </div>
                    <span className="text-sm font-medium">{badge.name}</span>
                    {badge.earned ? (
                      <Badge variant="secondary" className="mt-2">Earned</Badge>
                    ) : (
                      <Badge variant="outline" className="mt-2">Locked</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Your journey to becoming an Inventory Master</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Award className="h-10 w-10 text-primary" />
            <div className="flex-1">
              <Progress value={40} className="w-full" />
            </div>
            <span className="text-lg font-semibold">Level 4</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Keep up the great work! You're making excellent progress.</p>
        </CardContent>
      </Card>
    </div>
            
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }
  
  export default Achievements