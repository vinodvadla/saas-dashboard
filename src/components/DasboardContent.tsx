import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Revenue",
    value: "$1,200",
    change: "+12%",
    period: "vs last month",
    icon: DollarSign,
    positive: true
  },
  {
    title: "Purchases",
    value: "34",
    change: "+8%", 
    period: "vs last month",
    icon: ShoppingCart,
    positive: true
  },
  {
    title: "Visits",
    value: "80",
    change: "-2%",
    period: "vs last month", 
    icon: Users,
    positive: false
  },
  {
    title: "Conversions",
    value: "45%",
    change: "+15%",
    period: "vs last month",
    icon: TrendingUp,
    positive: true
  }
]

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your store analytics</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>📅 28 Oct - 20 Nov</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border hover:shadow-elegant transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className={`font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue | Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect your analytics to see real-time data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Regional data visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Joy Stick", status: "Completed", price: "$18.00", date: "Jan 23, 2021" },
                { name: "Junkfood", status: "Not Paid", price: "$12.00", date: "Jan 27, 2021" }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.price}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.status === "Completed" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}