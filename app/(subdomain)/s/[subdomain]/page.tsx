import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, Building2 } from "lucide-react"
import Link from "next/link"
import { getBlogsByOrgId } from "./actions"
import { formatDistanceToNow } from "date-fns"
import { clerkClient } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

interface SubdomainPageProps {
  params: Promise<{ subdomain: string }>
}

export default async function SubdomainPage({ params }: SubdomainPageProps) {
  const { subdomain } = await params

  try {
    // Get organization by slug (subdomain)
    const client = await clerkClient()
    const org = await client.organizations.getOrganization({
      slug: subdomain,
    })

    if (!org) {
      notFound()
    }

    const orgId = org.id
    const blogs = await getBlogsByOrgId(orgId)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto py-8 max-w-6xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{org.name}</h1>
                  <p className="text-muted-foreground">@{subdomain}</p>
                </div>
              </div>
              <p className="text-muted-foreground mt-2">
                Welcome to {org.name}'s blog • {blogs.length} {blogs.length === 1 ? "post" : "posts"}
              </p>
            </div>
            <Link href={`/s/${subdomain}/create`}>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Post
              </Button>
            </Link>
          </div>

          {/* Organization Info Card */}
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{org.name}</h3>
                  <p className="text-muted-foreground">Organization ID: {orgId}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created {formatDistanceToNow(new Date(org.createdAt), { addSuffix: true })}
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
            </CardContent>
          </Card>

          {/* Blog Posts Grid */}
          {blogs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <div className="p-3 bg-muted rounded-full w-fit mx-auto mb-4">
                    <PlusCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Get started by creating your first blog post for {org.name}
                  </p>
                  <Link href={`/s/${subdomain}/create`}>
                    <Button size="lg">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Your First Post
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">{blog.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                      {blog.body.substring(0, 150)}...
                    </p>
                    <Link href={`/s/${subdomain}/blog/${blog.id}`}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching organization:", error)
    notFound()
  }
}
