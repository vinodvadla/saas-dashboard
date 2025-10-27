import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { Menu, Bell, Search } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

interface DashboardLayoutProps {
  children: any
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-sidebar">
        <AppSidebar />
        <div className="flex-1 flex flex-col rounded-xl border-1 mx-2 my-3 overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b bg-background flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 hover:bg-muted rounded-md">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 min-w-[300px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder="Search anything..." 
                  className="bg-transparent border-0 outline-none flex-1 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
              </Button>
              <ModeToggle/>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">AS</span>
                </div>
                {/* <span className="text-sm font-medium">Ailee Studio</span> */}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}