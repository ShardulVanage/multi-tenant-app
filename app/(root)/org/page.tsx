import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { SignedIn, OrganizationList } from "@clerk/nextjs"

export default function OrganizationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Select Organization</h1>
          <p className="text-muted-foreground">Choose an organization to manage its blog, or create a new one.</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Your Organizations</CardTitle>
            <CardDescription>Select an organization to access its blog dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <SignedIn>
              <OrganizationList
                afterSelectOrganizationUrl="/org/:slug"
                afterCreateOrganizationUrl="/org/:slug"
                appearance={{
                  elements: {
                    organizationListCreateOrganizationButton: "bg-primary text-primary-foreground hover:bg-primary/90",
                    card: "shadow-none border",
                  },
                }}
              />
            </SignedIn>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
