import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  // Handle the redirect flow by rendering the component
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#8ba1f9] to-[#a3b8ff]">
      <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard" />
    </div>
  );
}
