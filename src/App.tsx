import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MultiSelect from "./MultiSelect";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, refetchOnWindowFocus: false, staleTime: Infinity },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MultiSelect />
    </QueryClientProvider>
  );
}

export default App;
