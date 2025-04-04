import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <>
    <Button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  variant="secondary"
  size="icon"
  className="inline-flex rounded-full relative hover:h-10 hover:w-10"
>
  {/* Moon Icon (Gray, shown when theme is Light) */}
  {theme === "light" && <Moon className="h-[1.2rem] w-[1.2rem] transition-all text-blue-500" />}

  {/* Sun Icon (Yellow, shown when theme is Dark) */}
  {theme === "dark" && <Sun className="h-[1.2rem] w-[1.2rem] transition-all text-amber-400" />}
</Button>
    </>
  )
}
