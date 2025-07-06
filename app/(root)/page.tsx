import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Building2, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignedOut } from "@clerk/nextjs"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Multi-Tenant Blog Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create and manage blogs for your organization with our powerful multi-tenant platform. Each organization
            gets its own subdomain and customized blog experience.
          </p>

          <SignedOut>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/sign-in">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sign-up">Create Account</Link>
              </Button>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/org">
                  <Building2 className="mr-2 h-4 w-4" />
                  Go to Organization
                </Link>
              </Button>
            </div>
          </SignedIn>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Multi-Tenant Architecture</CardTitle>
              <CardDescription>Each organization gets its own subdomain and isolated blog environment</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>Invite team members and manage permissions for your organization's blog</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Easy Publishing</CardTitle>
              <CardDescription>
                Create and publish blog posts with our intuitive editor and management system
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Create Organization</h3>
              <p className="text-muted-foreground">Set up your organization and choose a unique subdomain</p>
            </div>
            <div className="space-y-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Invite Team Members</h3>
              <p className="text-muted-foreground">Add team members and assign roles for content creation</p>
            </div>
            <div className="space-y-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Start Publishing</h3>
              <p className="text-muted-foreground">Create and publish blog posts on your custom subdomain</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <SignedOut>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="mb-6 opacity-90">Join thousands of organizations already using our platform</p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/sign-up">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your Organization
                </Link>
              </Button>
            </CardContent>
          </Card>
        </SignedOut>
      </div>
    </div>
  )
}
