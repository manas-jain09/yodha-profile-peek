
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Get the user's initials from their name (first letter or first letter of first and last name)
const getInitials = (name: string): string => {
  if (!name) return "";
  
  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

// Get a deterministic color based on the user's name
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-red-500", "bg-pink-500", "bg-purple-500", "bg-deep-purple-500",
    "bg-indigo-500", "bg-blue-500", "bg-cyan-500", "bg-teal-500",
    "bg-green-500", "bg-amber-500", "bg-orange-500"
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export const UserAvatar = ({ name, className = "", size = "md" }: UserAvatarProps) => {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg"
  };
  
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarFallback className={`${bgColor} text-white font-medium`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
