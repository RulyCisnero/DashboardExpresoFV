import Dashboard from "./pages/Dashboard"
import LoginPage from "./pages/LoginPage"
import { Toaster } from "./components/ui/toaster"
import { useAuth } from "./hooks/useAuth"

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    </div>
  )
}

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
      <Toaster />
    </>
  )
}

export default App
