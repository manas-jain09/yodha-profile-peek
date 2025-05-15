
// Export the toast hooks from radix-ui
import { useToast as useToastOriginal } from "@/components/ui/toast";
import { toast as toastOriginal } from "@/components/ui/toast";

// Re-export the hooks with the correct names
export const useToast = useToastOriginal;
export const toast = toastOriginal;
