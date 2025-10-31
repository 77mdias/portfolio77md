"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { Link, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import  z  from "zod"
import { useState } from "react";

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type SignInFormSchema = z.infer<typeof SignInFormSchema>;


export default function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormSchema>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data: SignInFormSchema) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe,
        },
        {
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
        }
      );
      if (res?.error) {
        setError(res.error.message || "Login failed");
      } else {
        window.location.reload();
      }
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={loading}
                {...register("email")}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                    placeholder="password"
                    autoComplete="password"
                    required
                    disabled={loading}
                    {...register("password")}
                  />
                  {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={() => setRememberMe(!rememberMe)}
                    disabled={loading}
                  />
                  <Label htmlFor="remember">Remember me</Label>
                </div>

                {error && <div className="text-xs text-red-500">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <p>Login</p>}
                </Button>

                <div className={cn("w-full gap-2 flex items-center", "justify-between flex-col")}> 
                  <Button
                    variant="outline"
                    className={cn("w-full gap-2")}
                    disabled={loading}
                    type="button"
                    onClick={async () => {
                      await signIn.social(
                        {
                          provider: "google",
                          callbackURL: "/profile"
                        },
                        {
                          onRequest: () => setLoading(true),
                          onResponse: () => setLoading(false),
                        },
                      );
                    }}
                  >
                    {/* ...SVG Google... */}
                    Sign in with Google
                  </Button>
                  <Button
                    variant="outline"
                    className={cn("w-full gap-2")}
                    disabled={loading}
                    type="button"
                    onClick={async () => {
                      await signIn.social(
                        {
                          provider: "discord",
                          callbackURL: "/profile"
                        },
                        {
                          onRequest: () => setLoading(true),
                          onResponse: () => setLoading(false),
                        },
                      );
                    }}
                  >
                    {/* ...SVG Discord... */}
                    Sign in with Discord
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
  </Card>
  );
}