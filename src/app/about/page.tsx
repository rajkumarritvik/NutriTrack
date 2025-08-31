import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="w-full">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">About Us</div>
              <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] font-headline">
                The Future of Nutrition is Here
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                NutriTrack was born from a simple idea: nutrition tracking should be easy, intelligent, and accessible to everyone. We're a team of developers, designers, and nutrition enthusiasts dedicated to helping you achieve your health goals through technology.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <Image
                src="https://picsum.photos/600/600"
                width="600"
                height="600"
                alt="Team working on the app"
                data-ai-hint="team working"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">How It Works</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                We've simplified nutrition down to three easy steps.
              </p>
              <ul className="grid gap-4">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground h-8 w-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-lg font-bold">Describe</h3>
                    <p className="text-muted-foreground">Tell our AI what you ate in plain English. No more searching through databases.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground h-8 w-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-lg font-bold">Analyze</h3>
                    <p className="text-muted-foreground">Instantly see a full breakdown of calories, macros, and vitamins.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground h-8 w-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-lg font-bold">Track</h3>
                    <p className="text-muted-foreground">Watch your progress on the dashboard and stay motivated on your health journey.</p>
                  </div>
                </li>
              </ul>
            </div>
            <Image
              src="https://picsum.photos/800/600"
              width="800"
              height="600"
              alt="Screenshot of the mobile app dashboard"
              data-ai-hint="mobile app"
              className="mx-auto overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Download The App</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                    Take NutriTrack with you wherever you go. Available now on iOS and Android.
                </p>
            </div>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90"><Link href="#">Download for iOS</Link></Button>
                <Button size="lg" asChild><Link href="#">Download for Android</Link></Button>
            </div>
        </div>
      </section>
    </div>
  );
}
