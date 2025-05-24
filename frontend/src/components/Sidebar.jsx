import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Menu,
  LayoutDashboard,
  Users,
  UserCircle,
  Settings,
  LogOut
} from "lucide-react"
import { disconnectSocket } from '@/services/socketService'

function Sidebar() {
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleLogout = () => {
    // Disconnect socket before logging out
    disconnectSocket()
    localStorage.removeItem('token')
    navigate('/auth')
  }

  return (
    <div className="relative">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">HangoutRoom</h2>
            </div>
            
            {/* Sidebar Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => handleNavigation('/home')}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Home Room
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => handleNavigation('/rooms')}
                >
                  <Users className="h-5 w-5" />
                  Create / Join Room
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => handleNavigation('/profile')}
                >
                  <UserCircle className="h-5 w-5" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => handleNavigation('/settings')}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => handleNavigation('/contactUs')}
                >
                  <Settings className="h-5 w-5" />
                  Contact Form
                </Button>
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Sidebar 