import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Building2 } from "lucide-react"
import Link from "next/link"
import { getBlogById, getOrganizationBySlug } from "../../actions"
import { formatDistanceToNow } from "date-fns"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
  params: Promise<{ subdomain: string; id: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { subdomain, id } = await params

  try {
    // Get both blog and organization data
    const [blog, organization] = await Promise.all([getBlogById(id), getOrganizationBySlug(subdomain)])

    if (!blog || !organization) {
      notFound()
    }

    // Verify the blog belongs to this organization
    if (blog.orgId !== organization.id) {
      notFound()
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
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Building2 className="h-4 w-4" />
                <span>{organization.name}</span>
                <span>•</span>
                <span>@{subdomain}</span>
              </div>
              <CardTitle className="text-3xl leading-tight">{blog.title}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground pt-2">
                <Calendar className="h-4 w-4" />
                <span>Published {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                {blog.body.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed text-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Organization info footer */}
          <Card className="mt-8 bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {organization.imageUrl && (
                  <img
                    src={organization.imageUrl || "/placeholder.svg"}
                    alt={organization.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold">{organization.name}</h4>
                  <p className="text-sm text-muted-foreground">@{subdomain}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading blog post:", error)
    notFound()
  }
}
