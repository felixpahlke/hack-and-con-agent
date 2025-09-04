import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import useAuth from "../../hooks/useAuth";
import { ModeToggle } from "../theme/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserMenu from "./UserMenu";

export function Header() {
  const { logout } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
  };

  const navItems: {
    title: string;
    path: string;
  }[] = [
    // { title: "Mail", path: "/mail" },
    // { title: "Items", path: "/items" },
  ];

  // if (currentUser?.is_superuser) {
  //   navItems.push({ title: "Admin", path: "/admin" });
  // }

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background">
      <div className="flex h-14 w-full items-center gap-2 px-4">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="mt-6 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="text-lg font-medium text-foreground/60 transition-colors hover:text-foreground/80"
                  >
                    {item.title}
                  </Link>
                ))}
                <Link
                  to="/settings"
                  className="text-lg font-medium text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  User Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-lg font-medium text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl">
              Mail<span className="font-semibold">Care</span>
            </span>
          </Link>
        )}

        <Separator
          orientation="vertical"
          className="mr-2 hidden h-4 md:block"
        />

        <nav className="hidden items-center space-x-8 pl-4 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="text-muted-foreground transition-colors hover:text-foreground/80"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          {!isMobile ? <UserMenu /> : null}
        </div>
      </div>
    </header>
  );
}
