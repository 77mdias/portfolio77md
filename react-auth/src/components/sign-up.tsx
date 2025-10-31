"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { signUp } from "@/lib/auth";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const SignUpFormSchema = z.object({
	firstName: z.string().min(2).max(100),
	lastName: z.string().min(2).max(100),
	email: z.string().email(),
	password: z.string().min(8).max(100),
	passwordConfirmation: z.string().min(8).max(100),
	image: z.any().optional(),
}).refine((data) => data.password === data.passwordConfirmation, {
	message: "Passwords do not match",
	path: ["passwordConfirmation"],
});

type SignUpFormSchema = z.infer<typeof SignUpFormSchema>;


export default function SignUp() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignUpFormSchema>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Watch password for real-time validation
  const password = watch("password") || "";
  
  // Password validation rules
  const passwordRules = [
    { label: "Mínimo 8 caracteres", valid: password.length >= 8 },
    { label: "Pelo menos 1 letra maiúscula", valid: /[A-Z]/.test(password) },
    { label: "Pelo menos 1 letra minúscula", valid: /[a-z]/.test(password) },
    { label: "Pelo menos 1 número", valid: /\d/.test(password) },
    { label: "Pelo menos 1 símbolo", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: SignUpFormSchema) => {
    setLoading(true);
    console.log("[Sign Up] Starting sign up process for:", data.email);

    try {
      const imageBase64 = data.image && data.image[0] ? await convertImageToBase64(data.image[0]) : undefined;

      console.log("[Sign Up] Calling signUp.email with backend URL:", import.meta.env.VITE_BETTER_AUTH_URL);

      await signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        image: imageBase64,
        callbackURL: "/dashboard",
        fetchOptions: {
          onResponse: (ctx) => {
            console.log("[Sign Up] Response received:", {
              status: ctx.response.status,
              headers: Object.fromEntries(ctx.response.headers.entries()),
            });
            setLoading(false);
          },
          onRequest: (ctx) => {
            console.log("[Sign Up] Request sent:", {
              url: ctx.url,
              method: ctx.method,
              credentials: ctx.credentials,
            });
            setLoading(true);
          },
          onError: (ctx) => {
            console.error("[Sign Up] Error:", ctx.error);
            toast.error(ctx.error.message);
          },
          onSuccess: async (ctx) => {
            console.log("[Sign Up] Success! Response data:", ctx.data);
            console.log("[Sign Up] Cookies after signup:", document.cookie);
            console.log("[Sign Up] Navigating to /profile...");
            navigate("/profile");
          },
        },
      });
    } catch (e: any) {
      console.error("[Sign Up] Caught exception:", e);
      toast.error(e?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max" required {...register("firstName")} />
              {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required {...register("lastName")} />
              {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required {...register("email")} />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" placeholder="Password" required {...register("password")} />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            
            {/* Password validation rules */}
            {password && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Requisitos da senha:</p>
                <ul className="space-y-1">
                  {passwordRules.map((rule, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        rule.valid 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                      }`}>
                        {rule.valid ? '✓' : '○'}
                      </span>
                      <span className={rule.valid ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                        {rule.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input id="password_confirmation" type="password" autoComplete="new-password" placeholder="Confirm Password" required {...register("passwordConfirmation")} />
            {errors.passwordConfirmation && <span className="text-xs text-red-500">{errors.passwordConfirmation.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Profile Image (optional)</Label>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                  <img src={imagePreview} alt="Profile preview" className="object-cover w-full h-full" />
                </div>
              )}
              <div className="flex items-center gap-2 w-full">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                {imagePreview && (
                  <X className="cursor-pointer" onClick={() => { setValue("image", undefined); setImagePreview(null); }} />
                )}
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Create an account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}