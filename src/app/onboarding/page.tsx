"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { saveUserProfile } from "@/ai/flows/save-user-profile"

const genders = ["Male", "Female", "Prefer not to say"];
const activityLevels = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extra Active"];

const formSchema = z.object({
  weight: z.coerce.number().positive("Weight must be positive."),
  height: z.coerce.number().positive("Height must be positive."),
  gender: z.string().min(1, "Please select a gender."),
  activityLevel: z.string().min(1, "Please select your activity level."),
  weightUnit: z.enum(["lbs", "kg"]),
  heightUnit: z.enum(["in", "cm"]),
})

export default function OnboardingPage() {
    const { toast } = useToast();
    const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: "" as any,
      height: "" as any,
      gender: "",
      activityLevel: "",
      weightUnit: "lbs",
      heightUnit: "in",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Onboarding data:", values)
    try {
      // In a real app this would be an API call to your backend
      await saveUserProfile(values);
      toast({
        title: "Profile saved!",
        description: "You're all set up. Welcome to NutriTrack!",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save profile", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Could not save your profile. Please try again.",
      });
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Tell us about yourself</CardTitle>
          <CardDescription>
            This information will help us personalize your nutrition plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <div className="flex">
                                <FormControl>
                                <Input type="number" placeholder="e.g., 150" {...field} />
                                </FormControl>
                                <FormField
                                    control={form.control}
                                    name="weightUnit"
                                    render={({ field: unitField }) => (
                                        <RadioGroup
                                            onValueChange={unitField.onChange}
                                            defaultValue={unitField.value}
                                            className="flex items-center ml-2"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl><RadioGroupItem value="lbs" id="lbs" /></FormControl>
                                                <FormLabel htmlFor="lbs" className="font-normal">lbs</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl><RadioGroupItem value="kg" id="kg" /></FormControl>
                                                <FormLabel htmlFor="kg" className="font-normal">kg</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Height</FormLabel>
                            <div className="flex">
                                <FormControl>
                                <Input type="number" placeholder="e.g., 68" {...field} />
                                </FormControl>
                                 <FormField
                                    control={form.control}
                                    name="heightUnit"
                                    render={({ field: unitField }) => (
                                        <RadioGroup
                                            onValueChange={unitField.onChange}
                                            defaultValue={unitField.value}
                                            className="flex items-center ml-2"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl><RadioGroupItem value="in" id="in" /></FormControl>
                                                <FormLabel htmlFor="in" className="font-normal">in</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl><RadioGroupItem value="cm" id="cm" /></FormControl>
                                                <FormLabel htmlFor="cm" className="font-normal">cm</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your activity level" />
                        </S'electTrigger>
                      </FormControl>
                      <SelectContent>
                        {activityLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Complete Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
