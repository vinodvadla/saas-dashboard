import {
  LayoutDashboard,
  Users,
  BatteryCharging,
  ExternalLink,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { logoutUser } from "@/redux/slices/authSlice";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Chargers",
    url: "/chargers",
    icon: BatteryCharging,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath: string = location.pathname;
  const collapsed: boolean = state === "collapsed";
  const dispatch = useDispatch<AppDispatch>();

  const isActive = (path: string): boolean => currentPath === path;

  // const isItemExpanded = (title: string): boolean =>
  //   expandedItems.includes(title);

  // const toggleExpanded = (title: string): void => {
  //   setExpandedItems((prev) =>
  //     prev.includes(title)
  //       ? prev.filter((item) => item !== title)
  //       : [...prev, title]
  //   );
  // };

  const getNavClassName = (active: boolean): string =>
    cn(
      "w-full justify-start transition-all duration-200 transform",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium scale-105 shadow-glow"
        : "text-sidebar-foreground hover:bg-sidebar-accent/20 hover:scale-105 hover:shadow-lg"
    );

  const handleLogout = async () => {
    try {
      let res:any = await dispatch(logoutUser()).unwrap();
      if(res&&res.data){
        console.log("res.data",res.data)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="bg-gradient-sidebar border-sidebar-border transition-all duration-300 ease-in-out animate-slide-in-left">
      <SidebarContent className="px-4 py-6 animate-fade-in">
        {/* Store Header */}
        <div className="mb-8 transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-3 mb-4 animate-scale-in">
            <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-glow hover:scale-110">
              <BatteryCharging className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <span className="text-sidebar-foreground font-semibold text-lg transition-opacity duration-300 animate-fade-in">
                AMC
              </span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 animate-fade-in">
              {navigationItems.map((item: NavItem, index: number) => (
                <SidebarMenuItem
                  key={item.title}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <SidebarMenuButton
                    className={cn(getNavClassName(isActive(item.url)), "group")}
                  >
                    <NavLink to={item.url} className="flex items-center w-full">
                      <item.icon
                        className={cn(
                          "w-4 h-4 mr-3 transition-transform duration-200",
                          isActive(item.url)
                            ? "scale-110 text-sidebar-accent-foreground"
                            : "group-hover:scale-110"
                        )}
                      />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {!collapsed && (
          <div className="mt-auto pt-4 border-t border-sidebar-border/20 animate-fade-in">
            <SidebarMenuButton className="w-full justify-start text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent/20 hover:scale-105 hover:shadow-md transform group" onClick={handleLogout}> 
              <ExternalLink className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110" />
              Logout
            </SidebarMenuButton>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
