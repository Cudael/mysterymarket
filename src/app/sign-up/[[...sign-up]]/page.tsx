import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F8F9FC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[16px] border border-[#D9DCE3]",
              card: "w-full rounded-[16px] bg-[#FFFFFF]",
              headerTitle: "text-[#1A1A1A] font-bold text-[24px]",
              headerSubtitle: "text-[#1A1A1A]/60 text-[15px]",
              socialButtonsBlockButton: "border-[#D9DCE3] bg-[#FFFFFF] hover:bg-[#F8F9FC] text-[#1A1A1A] h-11 rounded-[8px]",
              socialButtonsBlockButtonText: "text-[#1A1A1A] font-medium",
              dividerLine: "bg-[#D9DCE3]",
              dividerText: "text-[#1A1A1A]/40",
              formFieldLabel: "text-[#1A1A1A]/80 font-medium text-[13px]",
              formFieldInput: "h-11 rounded-[8px] border-[#D9DCE3] bg-[#FFFFFF] text-[#1A1A1A] focus:border-[#3A5FCD] focus:ring-[#3A5FCD]",
              formButtonPrimary: "h-11 rounded-[8px] bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all",
              footerActionText: "text-[#1A1A1A]/60",
              footerActionLink: "text-[#3A5FCD] hover:text-[#6D7BE0] font-medium",
              identityPreviewEditButtonIcon: "text-[#3A5FCD]"
            },
            variables: {
              colorPrimary: "#3A5FCD",
              colorText: "#1A1A1A",
              colorTextSecondary: "#666666",
              colorBackground: "#FFFFFF",
              colorDanger: "#D32F2F",
              fontFamily: "inherit",
              borderRadius: "8px",
            }
          }}
        />
      </div>
    </div>
  );
}
