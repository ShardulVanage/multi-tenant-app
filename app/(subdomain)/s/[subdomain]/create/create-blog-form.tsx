"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState, useTransition } from "react"
import { createBlogForOrganization } from "../actions"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Use the same serialized types
type SerializedOrganization = {
  id: string
  name: string
  slug: string
  imageUrl?: string
}

type SerializedMembership = {
  id: string
  role: string
  publicUserData: {
    userId: string
    firstName: string | null
    lastName: string | null
  }
}

interface CreateBlogFormProps {
  organization: SerializedOrganization
  subdomain: string
  userMembership: SerializedMembership
}

export function CreateBlogForm({ organization, subdomain, userMembership }: CreateBlogFormProps) {
  const router = useRouter()
  const [blogContent, setBlogContent] = useState("")
  const [blogTitle, setBlogTitle] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!blogTitle.trim() || !blogContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        const result = await createBlogForOrganization({
          body: blogContent.trim(),
          orgId: organization.id,
          title: blogTitle.trim(),
        })

        if (result.success) {
          toast({
            title: "Success",
            description: "Blog post created successfully!",
          })

          // Reset form
          setBlogTitle("")
          setBlogContent("")

          // Redirect to the blog
          router.push(`/s/${subdomain}`)
        } else {
          throw new Error(result.error || "Failed to create blog post")
        }
      } catch (error) {
        console.error("Error creating blog:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create blog post",
          variant: "destructive",
        })
      }
    })
  }

  // Get display name
  const displayName =
    userMembership.publicUserData.firstName && userMembership.publicUserData.lastName
      ? `${userMembership.publicUserData.firstName} ${userMembership.publicUserData.lastName}`
      : userMembership.publicUserData.firstName || "Anonymous User"

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{displayName.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium">{displayName}</p>
            <p className="text-sm text-muted-foreground">Publishing to {organization.name}</p>
          </div>
        </div>
        <Badge variant="secondary" className="capitalize">
          {userMembership.role.replace("_", " ")}
        </Badge>
      </div>

      <form onSubmit={handleCreateBlog} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter an engaging title..."
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            maxLength={80}
            required
          />
          <p className="text-sm text-muted-foreground">{blogTitle.length}/80 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your blog post content here..."
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            rows={15}
            className="min-h-[400px]"
            required
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending || !blogTitle.trim() || !blogContent.trim()}>
            {isPending ? "Publishing..." : "Publish Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setBlogTitle("")
              setBlogContent("")
            }}
            disabled={isPending}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  )
}
