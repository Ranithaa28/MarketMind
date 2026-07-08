"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const { isLoaded, signUp } = useSignUp();
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#8ba1f9] to-[#a3b8ff]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const [firstName, ...rest] = fullName.trim().split(" ");
      const lastName = rest.join(" ");

      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      toast.success("Verification code sent to your email!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.errors?.[0]?.message || "Something went wrong during sign up.");
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        toast.success("Account created successfully! Please log in.");
        router.push("/sign-in");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        toast.error("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.errors?.[0]?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const onOAuthWarning = () => {
    toast.warning("OAuth coming soon! Please use email for now.");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#809fff] via-[#94a8f3] to-[#a2b5f7] px-6">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#5f7deb] blur-[120px] opacity-60"></div>
      <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-[#c8d4ff] blur-[100px] opacity-60"></div>
      <div className="absolute left-[40%] top-[20%] h-[300px] w-[300px] rounded-full bg-[#7a95f2] blur-[80px] opacity-40"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[900px] rounded-[2.5rem] bg-white/20 p-8 md:p-14 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-2xl border border-white/40"
      >
        {!pendingVerification ? (
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            {/* Left Column */}
            <div className="flex flex-col justify-center">
              <h1 className="mb-8 text-4xl font-bold text-slate-900 tracking-tight">Sign Up</h1>
              <form id="signup-form" onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="h-14 w-full rounded-full border border-white/50 bg-white/60 px-6 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/80 transition-all shadow-inner"
                />
                <input
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Email Address"
                  className="h-14 w-full rounded-full border border-white/50 bg-white/60 px-6 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/80 transition-all shadow-inner"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="h-14 w-full rounded-full border border-white/50 bg-white/60 px-6 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/80 transition-all shadow-inner"
                />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="h-14 w-full rounded-full border border-white/50 bg-white/60 px-6 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/80 transition-all shadow-inner"
                />
              </form>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-center border-t border-white/30 pt-8 md:border-t-0 md:border-l md:pl-12 md:pt-0">
              <Button 
                form="signup-form"
                type="submit" 
                disabled={loading}
                className="h-14 w-full rounded-full bg-slate-900 text-lg font-medium hover:bg-slate-800 text-white shadow-lg"
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Sign Up
              </Button>
              
              <div className="mt-6 text-center text-slate-800">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-bold hover:text-slate-900">
                  Log in
                </Link>
              </div>

              <div className="my-8 flex items-center justify-center text-sm text-slate-700">
                <span className="bg-transparent px-2">Or</span>
              </div>

              <div className="space-y-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onOAuthWarning}
                  className="h-14 w-full rounded-full border border-slate-900/20 bg-white/40 hover:bg-white/60 text-slate-900 shadow-sm"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onOAuthWarning}
                  className="h-14 w-full rounded-full border border-slate-900/20 bg-white/40 hover:bg-white/60 text-slate-900 shadow-sm"
                >
                  <svg className="mr-2 h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Sign up with Facebook
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-slate-900 tracking-tight">Check your email</h1>
            <p className="mb-8 text-slate-800">
              We sent a verification code to <span className="font-semibold">{emailAddress}</span>
            </p>
            <form onSubmit={onPressVerify} className="w-full max-w-sm space-y-6">
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="h-14 w-full text-center text-2xl tracking-[0.5em] rounded-full border border-white/50 bg-white/60 px-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/80 transition-all shadow-inner"
              />
              <Button type="submit" className="h-14 w-full rounded-full bg-slate-900 text-lg font-medium hover:bg-slate-800 text-white shadow-lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Verify Email
              </Button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
