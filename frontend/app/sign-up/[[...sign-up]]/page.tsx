import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#809fff] via-[#94a8f3] to-[#a2b5f7] px-6 py-12">
      {/* Decorative Blur Orbs */}
      <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#5f7deb] blur-[120px] opacity-60"></div>
      <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-[#c8d4ff] blur-[100px] opacity-60"></div>
      <div className="absolute left-[40%] top-[20%] h-[300px] w-[300px] rounded-full bg-[#7a95f2] blur-[80px] opacity-40"></div>

      <div className="relative z-10">
        <SignUp 
          path="/sign-up" 
          routing="path" 
          signInUrl="/sign-in"
          appearance={{
            elements: {
              card: "shadow-2xl rounded-2xl border border-white/20",
            }
          }}
        />
      </div>
    </div>
  );
}
