/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

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
 


const teamMembers = [
    {
        name: "Devika Bongarde",
        role: "Developer",
        email: "devikabongarde@gmail.com",
        image: "/path-to-image.jpg"
    },
    {
        name: "Vinayak Kadate",
        role: "Developer",
        email: "kadatevinayak@gmail.com",
        image: "/path-to-image.jpg"
    },
    {
        name: "Avadhoot Gurav",
        role: "Developer",
        email: "avadhootgurav2309@gmail.com",
        image: "/path-to-image.jpg"
    },
]


const faqs = [
    {
        question: 'How do I add a new food item to my inventory?',
        answer: 'To add a new food item, go to your dashboard and click on the "Add Food Item" button. Fill in the required details such as name, category, quantity, and expiry date, then click "Submit".'
    },
    {
        question: 'How can I enable or disable expiry alerts for a food item?',
        answer: 'In your food inventory list, each item has a bell icon. Click on this icon to toggle alerts on or off for that specific item.'
    },
    {
        question: 'Can I edit the details of a food item after adding it?',
        answer: 'Currently, direct editing is not available. To update an item, you\'ll need to delete the existing entry and add a new one with the correct information. We\'re working on adding an edit feature in the future.'
    },
    {
        question: 'How do I delete a food item from my inventory?',
        answer: 'In your food inventory list, each item has a trash can icon. Click on this icon to remove the item from your inventory.'
    },
    {
        question: 'What do the different status badges mean?',
        answer: '"Fresh" means the item is not close to expiry. "Expiring Soon" appears when an item is within 3 days of its expiry date. "Expired" shows for items past their expiry date.'
    },
]

export default function Help() {
    const [user, setUser] = useState({
        name: 'DVAS',
        username: 'devi-ava-vin-shiv',
        avatarUrl: '/placeholder.svg?height=50&width=50'
    })

    const [complaint, setComplaint] = useState({ subject: '', message: '' })

    const handleComplaintSubmit = (e) => {
        e.preventDefault()
        console.log('Complaint submitted:', complaint)
        setComplaint({ subject: '', message: '' })
        alert('Your complaint has been submitted. We\'ll get back to you soon.')
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
                  <BreadcrumbItem>
                    <BreadcrumbPage>Help & Feedback</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto px-4 py-8">
            <header className="flex items-center space-x-4 mb-8">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                </div>
            </header>

            <main className="space-y-8">
                <section>
                    <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Submit feedback</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleComplaintSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                    <Input
                                        id="subject"
                                        value={complaint.subject}
                                        onChange={(e) => setComplaint({ ...complaint, subject: e.target.value })}
                                        placeholder="Brief description of your issue"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <Textarea
                                        id="message"
                                        value={complaint.message}
                                        onChange={(e) => setComplaint({ ...complaint, message: e.target.value })}
                                        placeholder="Provide more details about your complaint"
                                        required
                                        rows={4}
                                    />
                                </div>
                                <Button type="submit">Submit feedback</Button>
                            </form>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {faq.answer}
                                        </motion.div>
                                    </AnimatePresence>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

                <section>
                    <h2 className="text-3xl font-bold mb-4">Our Support Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map((member, index) => (
                            <Card key={index}>
                                <CardContent className="flex items-center space-x-4 p-6">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={member.image} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{member.name}</h3>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                        <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline">
                                            {member.email}
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>
        </div>
            
          </div>
        </SidebarInset>
      </SidebarProvider>
  
    )
}
