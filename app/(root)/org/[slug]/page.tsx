import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ExternalLink, Settings, Users } from "lucide-react"
import Link from "next/link"
import { clerkClient } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

interface OrgPageProps {
  params: Promise<{ slug: string }>
}

export default async function OrganizationDashboard({ params }: OrgPageProps) {
  const { slug } = await params

  try {
    const client = await clerkClient()
    const org = await client.organizations.getOrganization({
      slug: slug,
    })

    if (!org) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto py-8 max-w-6xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{org.name}</h1>
              <p className="text-muted-foreground">Organization Dashboard</p>
              <p className="text-sm text-muted-foreground mt-1">
                Blog URL: <span className="font-mono">{slug}.yourdomain.com</span>
              </p>
            </div>
            {org.imageUrl && (
              <img
                src={org.imageUrl || "/placeholder.svg"}
                alt={org.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
          </div>

          {/* Subdomain Access Banner */}
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Your Blog is Live!</h3>
                  <p className="text-muted-foreground mb-1">Your organization's blog is accessible at:</p>
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                    {process.env.NODE_ENV === "production" ? `${slug}.yourdomain.com` : `${slug}.localhost:3000`}
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link
                      href={
                        process.env.NODE_ENV === "production"
                          ? `https://${slug}.yourdomain.com`
                          : `http://${slug}.localhost:3000`
                      }
                      target="_blank"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Blog
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/s/${slug}`}>Preview</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <Link href={`/s/${slug}/create`} className="block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <PlusCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Create Post</h3>
                      <p className="text-sm text-muted-foreground">Write a new blog post</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <Link href={`http://${slug}.localhost:3000`} target="_blank" className="block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Visit Blog</h3>
                      <p className="text-sm text-blue-700">{slug}.localhost:3000</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Manage Team</h3>
                    <p className="text-sm text-muted-foreground">Coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Settings className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Settings</h3>
                    <p className="text-sm text-muted-foreground">Coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Organization Info */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Information about your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span> {org.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Slug:</span> {slug}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      {new Date(org.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Blog Access</h4>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
                      <Link href={`http://${slug}.localhost:3000`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Live Blog
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href={`/s/${slug}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Preview Blog (Internal)
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href={`/s/${slug}/create`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Post
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
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
