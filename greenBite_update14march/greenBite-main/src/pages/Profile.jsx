'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CameraIcon } from 'lucide-react'

export default function Profile() {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        bio: 'Food enthusiast and amateur chef. Love trying new recipes and sharing my culinary adventures!',
        avatarUrl: '/placeholder.svg?height=100&width=100'
    })

    const [isEditing, setIsEditing] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setProfile(prev => ({ ...prev, [name]: value }))
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatarUrl: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsEditing(false)
        console.log('Updated profile:', profile)
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your Food-Flux profile information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <div className="relative">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                            id="avatar-upload"
                                        />
                                        <Label
                                            htmlFor="avatar-upload"
                                            className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer"
                                        >
                                            <CameraIcon className="mr-2 h-4 w-4" />
                                            Change Avatar
                                        </Label>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            value={profile.username}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={profile.email}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                {isEditing ? (
                                    <>
                                        <Button type="submit" variant="default">Save Changes</Button>
                                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    </>
                                ) : (
                                    <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}