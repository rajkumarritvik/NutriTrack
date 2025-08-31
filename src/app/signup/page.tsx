
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export default function SignUpPage() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Sign up values:", values)
        // This is where you'd call your Firebase sign-up function
        toast({
          title: "Sign up successful!",
          description: "Redirecting you to the onboarding page...",
        });
        router.push("/onboarding");
    }

  return (
    <div className="flex items-center justify-center py-12 px-4 min-h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
            <CardDescription>
            Enter your information to create an account
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                Create an account
                </Button>
            </form>
            </Form>
            <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
                Sign in
            </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
