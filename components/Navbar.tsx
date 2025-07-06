"use client"

import { HomeIcon as HouseIcon, InboxIcon, PlusIcon, ZapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton, SignInButton, OrganizationSwitcher, useOrganization } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

// Navigation links array
const navigationLinks = [
  { href: "/", label: "Home", icon: HouseIcon },
  { href: "#", label: "Inbox", icon: InboxIcon },
  { href: "#", label: "Insights", icon: ZapIcon },
]

export default function Navbar() {
  const pathname = usePathname()
  const { organization } = useOrganization()

  // Determine if we're on a subdomain page
  const isSubdomainPage = pathname.startsWith("/s/")
  const subdomainMatch = pathname.match(/^\/s\/([^/]+)/)
  const currentSubdomain = subdomainMatch ? subdomainMatch[1] : null

  // Get create page URL based on current context
  const getCreateUrl = () => {
    if (isSubdomainPage && currentSubdomain) {
      return `/s/${currentSubdomain}/create`
    } else if (organization?.slug) {
      return `/s/${organization.slug}/create`
    }
    return "/org" // Fallback to organization selection
  }

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group size-8 md:hidden" variant="ghost" size="icon">
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="flex-row items-center gap-2 py-1.5"
                          active={isActive}
                        >
                          <Icon size={16} className="text-muted-foreground/80" aria-hidden="true" />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-2">
              {navigationLinks.map((link, index) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      active={isActive}
                      href={link.href}
                      className="text-foreground hover:text-primary flex-row items-center gap-2 py-1.5 font-medium"
                    >
                      <Icon size={16} className="text-muted-foreground/80" aria-hidden="true" />
                      <span>{link.label}</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Middle side: Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-primary hover:text-primary/90">
            <Image src={"/logo.png"} width={50} height={50} alt="logo" />
          </Link>
        </div>

        {/* Right side: Actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* Authentication */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <OrganizationSwitcher
              afterSelectOrganizationUrl={"/org/:slug"}
              appearance={{
                elements: {
                  organizationSwitcherTrigger: "border border-gray-300 rounded-md px-2 py-1",
                },
              }}
            />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </SignedIn>

          {/* Create Post button - only show for signed in users */}
          <SignedIn>
            <Button size="sm" className="text-sm" asChild>
              <Link href={getCreateUrl()}>
                <PlusIcon className="opacity-60 mr-1" size={16} aria-hidden="true" />
                <span>Post</span>
              </Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
