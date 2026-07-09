import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1a1e29] px-6">
      
      {/* Background Dashed Ring (Approximation of the uploaded screenshot) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
        <svg viewBox="0 0 800 800" className="w-[800px] h-[800px] animate-pulse-slow">
          <circle 
            cx="400" cy="400" r="300" 
            fill="none" 
            stroke="url(#cyan-gradient)" 
            strokeWidth="30" 
            strokeDasharray="15 25"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="1" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.01" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[450px] rounded-3xl bg-[#1E2433]/80 p-8 shadow-[0_0_50px_0_rgba(0,229,255,0.1)] backdrop-blur-md border border-white/5 flex flex-col items-center">
        <SignIn 
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none border-0 p-0 w-full",
              headerTitle: "text-3xl font-bold text-[#00E5FF] tracking-wide text-center",
              headerSubtitle: "hidden",
              formButtonPrimary: "bg-[#00E5FF] hover:bg-[#00d4ff] text-black font-semibold rounded-full h-12 w-full",
              formFieldInput: "bg-[#252C3D] border-[#374151] text-white rounded-xl h-12 focus:ring-[#00E5FF] focus:border-[#00E5FF]",
              formFieldLabel: "text-gray-300",
              footerActionLink: "text-[#00E5FF] hover:text-[#00d4ff] font-medium",
              dividerLine: "bg-[#374151]",
              dividerText: "text-gray-400",
              socialButtonsBlockButton: "border-[#374151] bg-[#252C3D] text-white hover:bg-[#374151] rounded-xl h-12",
              socialButtonsBlockButtonText: "text-white font-medium",
              identityPreviewEditButtonIcon: "text-[#00E5FF]"
            }
          }}
        />
      </div>
    </div>
  );
}
