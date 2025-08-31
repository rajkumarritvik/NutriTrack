"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ContactPage() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Subscribing email:", values.email);
        toast({
          title: "You're subscribed!",
          description: "Thanks for signing up. We'll keep you updated on the latest news.",
        });
        form.reset();
    }

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-8rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Contact Us</h1>
            <p className="text-balance text-muted-foreground">
              Have questions or want to stay updated? Drop your email below.
            </p>
          </div>
            <Card>
                <CardHeader>
                    <CardTitle>Subscribe to Updates</CardTitle>
                    <CardDescription>Get notified about new features, diet plans, and more.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                                Subscribe
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
          <div className="mt-4 text-center text-sm">
            You can also reach us at{" "}
            <a href="mailto:support@nutritrackgo.com" className="underline">
              support@nutritrackgo.com
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://picsum.photos/1200/1800"
          alt="Fresh vegetables on a table"
          data-ai-hint="contact vegetables"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
        />
      </div>
    </div>
  )
}
