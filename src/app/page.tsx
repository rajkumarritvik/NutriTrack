import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart, BrainCircuit, Check, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    Meet NutriTrack: Your AI Nutritionist
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Effortlessly track your meals, get personalized diet plans, and visualize your progress. Take control of your health with the power of AI.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                    <Link href="/signin">
                      Start Tracking
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/1200/800"
                width={1200}
                height={800}
                alt="Healthy food bowl"
                data-ai-hint="healthy food"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Eat Smarter, Live Better</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides you with the tools and insights to make informed decisions about your nutrition and achieve your health goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">AI Meal Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Just say what you ate. Our AI breaks down your meals into detailed nutritional information in seconds. No more manual entry.</CardDescription>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <HeartPulse className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Custom Diet Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Whether for weight loss, muscle gain, or balanced living, get AI-generated diet plans tailored to your goals and preferences.</CardDescription>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Progress Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Visualize your journey with intuitive charts for calorie intake, macro distribution, and long-term progress tracking.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-24">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">How to Get Started</h2>
                <p className="text-muted-foreground md:text-lg/relaxed">
                  To access the NutriTrack app, you'll first need to use the Expo Go app. It's a quick process that allows you to start your free health journey right away.
                </p>
                <ol className="grid gap-4 list-decimal list-inside">
                  <li className="text-muted-foreground"><span className="font-semibold text-foreground">Download Expo Go</span> from the App Store or Google Play.</li>
                  <li className="text-muted-foreground"><span className="font-semibold text-foreground">Sign up for a free account</span> within the Expo Go app.</li>
                  <li className="text-muted-foreground"><span className="font-semibold text-foreground">Scan the QR code</span> on this page, and NutriTrack will launch instantly inside Expo Go.</li>
                </ol>
                <ul className="grid gap-2">
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Free to download</li>
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> No hidden fees</li>
                    <li className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500" /> Easy to use</li>
                </ul>
                <div className="flex justify-center lg:justify-start">
                    <Image
                        src="https://picsum.photos/200/200"
                        width={200}
                        height={200}
                        alt="QR Code"
                        data-ai-hint="qr code"
                        className="rounded-lg shadow-md"
                    />
                </div>
              </div>
              <div className="flex items-center justify-center">
                 <Image
                    src="https://picsum.photos/350/700"
                    width={350}
                    height={700}
                    alt="App dashboard on phone"
                    data-ai-hint="app dashboard"
                    className="rounded-3xl shadow-2xl"
                 />
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Transform Your Health?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who are already achieving their fitness goals with NutriTrack. Get started for free today.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90">
                <Link href="/signin">
                  Get Started Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
