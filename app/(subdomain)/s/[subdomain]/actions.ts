"use server"

import { db } from "@/db"
import { blogTable, type CreateBlogType } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { clerkClient } from "@clerk/nextjs/server"
import { auth } from "@clerk/nextjs/server"

export const createBlogForOrganization = async (payload: CreateBlogType) => {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      throw new Error("You must be signed in to create a blog post")
    }

    // Validate payload
    if (!payload.title?.trim()) {
      throw new Error("Title is required")
    }

    if (!payload.body?.trim()) {
      throw new Error("Content is required")
    }

    if (!payload.orgId?.trim()) {
      throw new Error("Organization ID is required")
    }

    // Verify user is a member of the organization
    const client = await clerkClient()
    try {
      const membershipList = await client.organizations.getOrganizationMembershipList({
        organizationId: payload.orgId,
      })

      const userMembership = membershipList.data.find(
        (membership) => membership.publicUserData?.userId === userId
      )

      if (!userMembership) {
        throw new Error("You are not authorized to create posts for this organization")
      }

      // Optional: Check role-based permissions
      // if (userMembership.role === 'basic_member') {
      //   throw new Error("You don't have permission to create posts")
      // }
    } catch (membershipError) {
      console.error("Membership check error:", membershipError)
      throw new Error("You are not authorized to create posts for this organization")
    }

    // Create the blog post
    const result = await db.insert(blogTable).values({
      title: payload.title.trim(),
      body: payload.body.trim(),
      orgId: payload.orgId.trim(),
    })

    // Revalidate the subdomain page
    revalidatePath("/s/[subdomain]", "page")

    return { success: true, data: result }
  } catch (error) {
    console.error("Error creating blog:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create blog post",
    }
  }
}

export const getBlogsByOrgId = async (orgId: string) => {
  try {
    const blogs = await db.select().from(blogTable).where(eq(blogTable.orgId, orgId)).orderBy(blogTable.createdAt)

    return blogs
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return []
  }
}

export const getBlogById = async (id: string) => {
  try {
    const blog = await db.select().from(blogTable).where(eq(blogTable.id, id)).limit(1)

    return blog[0] || null
  } catch (error) {
    console.error("Error fetching blog:", error)
    return null
  }
}

export const getOrganizationBySlug = async (slug: string) => {
  try {
    const client = await clerkClient()
    const org = await client.organizations.getOrganization({
      slug: slug,
    })

    return org
  } catch (error) {
    console.error("Error fetching organization:", error)
    return null
  }
}
