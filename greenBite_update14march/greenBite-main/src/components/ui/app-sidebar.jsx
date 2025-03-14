
import * as React from "react"
import {
  BookOpen,
  CookingPot,
  Command,
  Utensils,
  Frame,
  LifeBuoy,
  Users,
  PieChart,
  Send,
  UserRound,
  Award,
  Settings2,
  LayoutDashboard,
  Info,
  CircleDollarSign,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "devikabongarde",
    email: "d@example.com",
    avatar: UserRound,
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard
     
    },
    {
      title: "NGO Donations",
      url: "/donations",
      icon: CircleDollarSign,
    },
    {
      title: "Crowd Funding",
      url: "/crowdfunding",
      icon: Users,
    },
    {
      title: "Recipe Generator",
      url: "/chatbot",
      icon: CookingPot,
    },
    {
      title: "Achievements",
      url: "/achievements",
      icon: Award,
    },
    /* {
      title: "Documentation",
      url: "/docs",
      icon: BookOpen,

    }, */
    {
      title: "About",
      url: "/about",
      icon: Info,

    },
  ],
  navSecondary: [
    {
      title: "Help & Feedback",
      url: "/help",
      icon: LifeBuoy,
    },

  ],
  projects: [
    {
      name: "Food items",
      url: "/items",
      icon: Utensils,
    },
    
  ],
}

export function AppSidebar(props) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src="/icon.png" alt="Logo" className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">GreenBite</span>
                  <span className="truncate text-xs">Food Waste Manager</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
