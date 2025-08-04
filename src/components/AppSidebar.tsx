import { useState } from "react"
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Tag, 
  HelpCircle, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Settings,
  CreditCard
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    isActive: true
  },
  { 
    title: "Analytics", 
    url: "/analytics", 
    icon: BarChart3,
    hasSubmenu: true,
    submenu: [
      { title: "Overview", url: "/analytics/overview" },
      { title: "Reports", url: "/analytics/reports" },
      { title: "Insights", url: "/analytics/insights" }
    ]
  },
  { 
    title: "Products", 
    url: "/products", 
    icon: Package,
    hasSubmenu: true,
    submenu: [
      { title: "All Products", url: "/products/all" },
      { title: "Categories", url: "/products/categories" },
      { title: "Inventory", url: "/products/inventory" }
    ]
  },
  { 
    title: "Orders", 
    url: "/orders", 
    icon: ShoppingCart,
    hasSubmenu: true
  },
  { 
    title: "Feedback", 
    url: "/feedback", 
    icon: MessageSquare 
  },
  { 
    title: "Coupons", 
    url: "/coupons", 
    icon: Tag 
  },
  { 
    title: "Queries", 
    url: "/queries", 
    icon: HelpCircle 
  },
  { 
    title: "Customization", 
    url: "/customization", 
    icon: Settings,
    hasSubmenu: true
  },
  { 
    title: "Developer", 
    url: "/developer", 
    icon: Settings,
    hasSubmenu: true
  },
  { 
    title: "Subscriptions", 
    url: "/subscriptions", 
    icon: CreditCard,
    hasSubmenu: true
  }
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const [expandedItems, setExpandedItems] = useState<string[]>(["Analytics"])
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const isItemExpanded = (title: string) => expandedItems.includes(title)

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const getNavClassName = (active: boolean) => 
    cn(
      "w-full justify-start text-sidebar-foreground transition-all duration-200 ease-in-out hover:bg-sidebar-accent/20 hover:scale-105 hover:shadow-lg transform",
      active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium scale-105 shadow-glow"
    )

  return (
    <Sidebar className="bg-gradient-sidebar border-sidebar-border transition-all duration-300 ease-in-out animate-slide-in-left">
      <SidebarContent className="px-4 py-6 animate-fade-in">
        {/* Store Header */}
        <div className="mb-8 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-3 mb-4 animate-scale-in">
            <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-glow hover:scale-110">
              <Package className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <span className="text-sidebar-foreground font-semibold text-lg transition-opacity duration-300 animate-fade-in">
                Ailee Store
              </span>
            )}
          </div>
          
          {!collapsed && (
            <Button 
              variant="secondary" 
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground border-0 transition-all duration-200 hover:scale-105 hover:shadow-elegant animate-scale-in"
            >
              Visit Store
              <ExternalLink className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 animate-fade-in">
              {navigationItems.map((item, index) => (
                <SidebarMenuItem 
                  key={item.title} 
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div>
                    {item.hasSubmenu ? (
                      <SidebarMenuButton
                        onClick={() => toggleExpanded(item.title)}
                        className={cn(
                          getNavClassName(isActive(item.url)),
                          "group"
                        )}
                      >
                        <item.icon className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            <div className="transition-transform duration-300 ease-in-out">
                              {isItemExpanded(item.title) ? (
                                <ChevronDown className="w-4 h-4 rotate-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 rotate-0" />
                              )}
                            </div>
                          </>
                        )}
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton className={cn(getNavClassName(isActive(item.url)), "group")}>
                        <NavLink 
                          to={item.url} 
                          className="flex items-center w-full"
                        >
                          <item.icon className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                    
                    {/* Animated Submenu */}
                    {item.hasSubmenu && item.submenu && !collapsed && (
                      <div 
                        className={cn(
                          "ml-7 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                          isItemExpanded(item.title) 
                            ? "max-h-96 opacity-100 animate-submenu-expand" 
                            : "max-h-0 opacity-0"
                        )}
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <SidebarMenuButton 
                            key={subItem.title}
                            className={cn(
                              "text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 pl-4 py-2 transition-all duration-200 hover:scale-105 hover:shadow-md transform group",
                              isActive(subItem.url) && "text-sidebar-foreground font-medium bg-sidebar-accent/20"
                            )}
                            style={{ 
                              animationDelay: isItemExpanded(item.title) ? `${subIndex * 0.1}s` : '0s' 
                            }}
                          >
                            <NavLink 
                              to={subItem.url}
                              className="flex items-center w-full"
                            >
                              <span className="w-2 h-2 bg-sidebar-foreground/40 rounded-full mr-3 transition-all duration-200 group-hover:bg-sidebar-foreground group-hover:scale-125"></span>
                              {subItem.title}
                            </NavLink>
                          </SidebarMenuButton>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        {!collapsed && (
          <div className="mt-auto pt-4 border-t border-sidebar-border/20 animate-fade-in">
            <SidebarMenuButton className="w-full justify-start text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent/20 hover:scale-105 hover:shadow-md transform group">
              <ExternalLink className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110" />
              Logout
            </SidebarMenuButton>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}