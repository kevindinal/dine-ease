import { GalleryVerticalEnd } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import Image from "next/image";

const SignIn = () => {
  
  return (
    <div className="grid min-h-svh lg:grid-cols-2 py-6">
      {/* Left side: Scrollable form section */}
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-center gap-2 ">
          <a href="" className="flex items-center gap-2 font-medium">
            <div className="flex items-center justify-center">
              <Image 
                src="/logo.png"
                alt="Logo"
                width={150}
                height={150}
              />
            </div>
            {/* DineEase */}
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center pb-5">
          <div className="w-full max-w-xs">
            <AuthForm type="sign-in" />
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div className="fixed inset-y-0 right-0 w-1/2 bg-muted">
          <img
            src="/auth-image.jpg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
