import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#809fff] via-[#94a8f3] to-[#a2b5f7] px-6">
      {/* Decorative Blur Orbs */}
      <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#5f7deb] blur-[120px] opacity-60"></div>
      <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-[#c8d4ff] blur-[100px] opacity-60"></div>
      <div className="absolute left-[40%] top-[20%] h-[300px] w-[300px] rounded-full bg-[#7a95f2] blur-[80px] opacity-40"></div>

      <div className="relative z-10 w-full max-w-[900px] rounded-[2.5rem] bg-white/20 p-8 md:p-14 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-2xl border border-white/40 grid gap-12 md:grid-cols-2 md:gap-8 items-center">
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-800 text-lg">Log in to your account to continue validating your startup ideas with MarketMind.</p>
        </div>

        {/* Right Column */}
        <div className="flex justify-center md:justify-end">
          <SignIn 
            forceRedirectUrl="/dashboard" 
            appearance={{
              elements: {
                rootBox: "shadow-none w-full max-w-sm",
                card: "bg-white/80 shadow-none backdrop-blur-sm border border-white/50 w-full",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
