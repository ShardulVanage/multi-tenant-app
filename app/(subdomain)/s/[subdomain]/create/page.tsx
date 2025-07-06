import { CreateBlogForm } from "./create-blog-form"
import { clerkClient } from "@clerk/nextjs/server"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building2 } from "lucide-react"
import Link from "next/link"

interface CreatePageProps {
  params: Promise<{ subdomain: string }>
}

// Serialize the organization data
type SerializedOrganization = {
  id: string
  name: string
  slug: string
  imageUrl?: string
}

// Serialize the membership data
type SerializedMembership = {
  id: string
  role: string
  publicUserData: {
    userId: string
    firstName: string | null
    lastName: string | null
  }
}

export default async function CreateBlogPage({ params }: CreatePageProps) {
  // Check if user is authenticated
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const { subdomain } = await params

  try {
    // Get organization by slug (subdomain)
    const client = await clerkClient()
    const organization = await client.organizations.getOrganization({
      slug: subdomain,
    })

    if (!organization) {
      notFound()
    }

    // Check if user is a member of this organization
    const membershipList = await client.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    })

    const userMembership = membershipList.data.find((membership) => membership.publicUserData.userId === userId)

    if (!userMembership) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground mb-4">
                You are not a member of the {organization.name} organization.
              </p>
              <Link href={`/s/${subdomain}`} className="text-primary hover:underline">
                Back to {organization.name}
              </Link>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Serialize the data to pass to client component
    const serializedOrganization: SerializedOrganization = {
      id: organization.id,
      name: organization.name,
      slug: organization.slug || subdomain,
      imageUrl: organization.imageUrl || undefined,
    }

    const serializedMembership: SerializedMembership = {
      id: userMembership.id,
      role: userMembership.role,
      publicUserData: {
        userId: userMembership.publicUserData?.userId ?? "",
        firstName: userMembership.publicUserData?.firstName ?? null,
        lastName: userMembership.publicUserData?.lastName ?? null,
      },
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="mb-8">
            <Link
              href={`/s/${subdomain}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {organization.name}
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Create New Post</h1>
                <p className="text-muted-foreground">Publishing to {organization.name}</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New Blog Post</CardTitle>
              <CardDescription>Share your thoughts with {organization.name}'s audience</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateBlogForm
                organization={serializedOrganization}
                subdomain={subdomain}
                userMembership={serializedMembership}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching organization:", error)
    notFound()
  }
}
