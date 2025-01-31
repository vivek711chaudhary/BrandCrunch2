import { cn } from "../../lib/utils"

const Loader = ({ className, size = "default", ...props }) => {
  return (
    <div
      className={cn(
        "relative",
        size === "default" && "h-16 w-16",
        size === "sm" && "h-8 w-8",
        size === "lg" && "h-24 w-24",
        className
      )}
      {...props}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
      
      {/* Spinning ring */}
      <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-loader" />
      
      {/* Inner pulsing circle */}
      <div className="absolute inset-[25%] rounded-full bg-primary/20 animate-pulse" />
    </div>
  )
}

export { Loader }
