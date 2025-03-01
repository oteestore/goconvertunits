import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, Menu, User } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  userAvatar?: string;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onSignOut?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  userName = "User",
  userAvatar = "",
  onSignIn = () => {},
  onSignUp = () => {},
  onSignOut = () => {},
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full h-20 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center">
        <div className="text-2xl font-bold text-primary">GoConvertUnits</div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userName}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onSignIn}>
              Sign In
            </Button>
            <Button onClick={onSignUp}>Sign Up</Button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        {isMobileMenuOpen && (
          <div className="absolute top-20 right-0 w-full bg-white shadow-md z-50 border-t border-gray-100">
            <div className="p-4 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 p-2">
                    <Avatar>
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{userName}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={onSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onSignIn}
                  >
                    Sign In
                  </Button>
                  <Button className="w-full" onClick={onSignUp}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
