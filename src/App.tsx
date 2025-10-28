import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/them-provider";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Router from "./routes/Router";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();
const App = () => (
  <Provider store={store}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </Provider>
);

export default App;
