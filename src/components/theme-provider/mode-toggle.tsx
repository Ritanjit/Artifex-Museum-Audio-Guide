// src\components\theme-provider\mode-toggle.tsx
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider/theme-provider"
import { SunIcon, SunIconHandle } from "@/components/ui/sun"
import { MoonIcon, MoonIconHandle } from "@/components/ui/moon"
import { useRef } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const sunIconRef = useRef<SunIconHandle>(null)
  const moonIconRef = useRef<MoonIconHandle>(null)

  const handleMouseEnter = () => {
    if (theme === "light") {
      sunIconRef.current?.startAnimation()
    } else {
      moonIconRef.current?.startAnimation()
    }
  }

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant={theme === "light" ? "invisible" : "ghost"}
      size="icon"
      className="inline-flex rounded-full relative hover:h-10 hover:w-10"
      onMouseEnter={handleMouseEnter}
    >
      {/* Sun Icon (shown when theme is Light) */}
      {theme === "light" && (
        <SunIcon
          ref={sunIconRef}
          className="h-[1.2rem] w-[1.2rem] transition-all text-amber-400"
          size={20}
        />
      )}

      {/* Moon Icon (shown when theme is Dark) */}
      {theme === "dark" && (
        <MoonIcon
          ref={moonIconRef}
          className="h-[1.2rem] w-[1.2rem] transition-all text-blue-400"
          size={20}
        />
      )}
    </Button>
  )
}