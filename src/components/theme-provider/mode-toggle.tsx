import { Ghost, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <>
    <Button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  variant={theme === "light" ? "invisible" : "ghost"}
  size="icon"
  className="inline-flex rounded-full relative hover:h-10 hover:w-10"
>
  {/* Moon Icon (Gray, shown when theme is Light) */}
  {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem] transition-all text-amber-400" />}

  {/* Sun Icon (Yellow, shown when theme is Dark) */}
  {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem] transition-all text-blue-400" />}
</Button>
    </>
  )
}
