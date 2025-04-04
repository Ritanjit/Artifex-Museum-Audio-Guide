import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { ModeToggle } from "../theme-provider/mode-toggle";
import logo1 from "../../assets/logo-light.png";
import { useTheme } from "@/components/theme-provider/theme-provider"

const Navbar04Page = () => {

  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-muted">
      <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
        <div className="h-full flex items-center justify-between mx-auto px-4 pl-4">
        {theme !== "dark" && (
          <img src={logo1} alt="Logo" className="h-10 w-auto rounded-[100px]" />
        )}
        {theme !== "light" && (
          <img src={logo1} alt="Logo" className="h-10 w-auto rounded-[100px]" />
        )}
          {/* <Logo /> */}

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            {/* <Button
              variant="outline"
              className="hidden sm:inline-flex rounded-full"
            >
              Login
            </Button> */}
            <Button className="rounded-[100px]">Login</Button>
            < ModeToggle />
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar04Page;
