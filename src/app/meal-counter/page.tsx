"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { aiMealInput, type AiMealOutputType } from "@/ai/flows/ai-meal-input";
import { updateDashboardWithMeal } from "@/ai/flows/update-dashboard-with-meal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Flame, Beef, Wheat, Droplets, Sparkles, Camera, Upload, Wind, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  mealDescription: z.string().optional(),
  photoDataUri: z.string().optional(),
}).refine(data => data.mealDescription || data.photoDataUri, {
    message: "Please describe your meal or provide a photo.",
    path: ['mealDescription'],
});

export default function MealCounterPage() {
  const [nutritionData, setNutritionData] = useState<AiMealOutputType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingDashboard, setIsUpdatingDashboard] = useState(false);
  const [dashboardUpdated, setDashboardUpdated] = useState(false);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("text");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealDescription: "",
      photoDataUri: "",
    },
  });
  
  useEffect(() => {
    if (activeTab === 'scan') {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      };
      getCameraPermission();
    } else {
        // Stop camera stream when switching tabs
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [activeTab, toast]);


  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        form.setValue("photoDataUri", dataUri);
        form.setValue("mealDescription", ""); // Clear description
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setCapturedImage(dataUri);
        form.setValue("photoDataUri", dataUri);
        form.setValue("mealDescription", ""); // Clear description
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
      setCapturedImage(null);
      form.setValue("photoDataUri", "");
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setNutritionData(null);
    setDashboardUpdated(false);

    try {
      const result = await aiMealInput(values);
      setNutritionData(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with our AI. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateDashboard() {
      if(!nutritionData) return;
      setIsUpdatingDashboard(true);
      try {
          await updateDashboardWithMeal({mealData: nutritionData});
          setDashboardUpdated(true);
          toast({
              title: "Dashboard Updated!",
              description: "Your meal has been added to your dashboard.",
          })
      } catch (error) {
          console.error(error);
          toast({
              variant: "destructive",
              title: "Update Failed",
              description: "Could not update the dashboard. Please try again.",
          })
      } finally {
          setIsUpdatingDashboard(false);
      }
  }


  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">AI-Powered Meal Counter</h1>
          <p className="text-muted-foreground">
            Describe your meal, scan it with your camera, or upload a photo. Our AI will handle the rest.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Describe</TabsTrigger>
                <TabsTrigger value="scan">Scan</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="text">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                            control={form.control}
                            name="mealDescription"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-lg">Describe Your Meal</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="e.g., A bowl of oatmeal with blueberries and almonds..."
                                    className="min-h-[120px] resize-none"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setCapturedImage(null);
                                        form.setValue("photoDataUri", "");
                                    }}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Analyze Meal</>}
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="scan">
                 <Card className="shadow-lg">
                    <CardContent className="p-6 space-y-4">
                        <div className="relative aspect-video w-full bg-secondary rounded-md overflow-hidden flex items-center justify-center">
                            {capturedImage ? (
                                <Image src={capturedImage} alt="Captured meal" layout="fill" objectFit="cover" />
                            ) : (
                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            )}
                            
                            {hasCameraPermission === false && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                                   <Camera className="h-10 w-10 mb-2"/>
                                   <p className="text-center">Camera access is required. Please enable it in your browser settings.</p>
                                </div>
                            )}
                        </div>
                        
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        
                        {capturedImage ? (
                             <div className="flex gap-2">
                                <Button onClick={resetCapture} variant="outline" className="w-full">Retake</Button>
                                <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Analyze Photo</>}
                                </Button>
                             </div>
                        ) : (
                            <Button onClick={captureImage} disabled={isLoading || hasCameraPermission !== true} className="w-full">
                                <Camera className="mr-2 h-4 w-4" /> Capture Photo
                            </Button>
                        )}

                        { hasCameraPermission === null && (
                            <Alert>
                                <AlertTitle>Camera Access</AlertTitle>
                                <AlertDescription>
                                    Requesting camera permission to scan your meal...
                                </AlertDescription>
                            </Alert>
                        )}
                        { hasCameraPermission === false && (
                            <Alert variant="destructive">
                                <AlertTitle>Camera Access Denied</AlertTitle>
                                <AlertDescription>
                                    Please allow camera access in your browser settings to use this feature.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="upload">
                <Card className="shadow-lg">
                    <CardContent className="p-6 space-y-4">
                         <div className="relative aspect-video w-full bg-secondary rounded-md overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            {capturedImage ? (
                                <Image src={capturedImage} alt="Uploaded meal" layout="fill" objectFit="cover" />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Upload className="h-10 w-10 mx-auto mb-2"/>
                                    <p>Click to upload a photo</p>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                        {capturedImage ? (
                             <div className="flex gap-2">
                                <Button onClick={resetCapture} variant="outline" className="w-full">Clear</Button>
                                <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Analyze Photo</>}
                                </Button>
                             </div>
                        ) : (
                            <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-full">
                                <Upload className="mr-2 h-4 w-4" /> Select Photo
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground mt-2">Our AI is analyzing your meal...</p>
          </div>
        )}

        {nutritionData && (
          <Card className="mt-8 animate-fade-in shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Nutrition Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="flex flex-col items-center space-y-1 rounded-lg p-4 bg-secondary">
                  <Flame className="h-8 w-8 text-accent" />
                  <span className="text-sm text-muted-foreground">Calories</span>
                  <span className="text-2xl font-bold">{nutritionData.calories}</span>
                </div>
                <div className="flex flex-col items-center space-y-1 rounded-lg p-4 bg-secondary">
                  <Beef className="h-8 w-8 text-accent" />
                  <span className="text-sm text-muted-foreground">Protein</span>
                  <span className="text-2xl font-bold">{nutritionData.protein}g</span>
                </div>
                <div className="flex flex-col items-center space-y-1 rounded-lg p-4 bg-secondary">
                  <Wheat className="h-8 w-8 text-accent" />
                  <span className="text-sm text-muted-foreground">Carbs</span>
                  <span className="text-2xl font-bold">{nutritionData.carbs}g</span>
                </div>
                <div className="flex flex-col items-center space-y-1 rounded-lg p-4 bg-secondary">
                  <Droplets className="h-8 w-8 text-accent" />
                  <span className="text-sm text-muted-foreground">Fat</span>
                  <span className="text-2xl font-bold">{nutritionData.fat}g</span>
                </div>
                 <div className="flex flex-col items-center space-y-1 rounded-lg p-4 bg-secondary">
                  <Wind className="h-8 w-8 text-accent" />
                  <span className="text-sm text-muted-foreground">Sugar</span>
                  <span className="text-2xl font-bold">{nutritionData.sugar}g</span>
                </div>
              </div>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Vitamins</h3>
                <p className="text-muted-foreground">{nutritionData.vitamins}</p>
              </div>
              <Separator className="my-6" />
              <div className="mt-6">
                {dashboardUpdated ? (
                    <Button disabled className="w-full">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Dashboard Updated
                    </Button>
                ) : (
                    <Button onClick={handleUpdateDashboard} disabled={isUpdatingDashboard} className="w-full">
                        {isUpdatingDashboard ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding to Dashboard...</> : 'Add to Dashboard'}
                    </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

    