import { GalleryVerticalEnd } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import Image from "next/image";

const SignUp = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side: Scrollable form section */}
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            {/* <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div> */}
            <div className="flex items-center justify-center">
              <Image 
                src="/logo.svg"
                alt="Logo"
                width={50}
                height={50}
              />
            </div>
            DineEase
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AuthForm type="sign-up" />
          </div>
        </div>
      </div>

      {/* Right side: Fixed image section */}
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

export default SignUp;
