import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA] px-4 py-12">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#3A5FCD",
              colorText: "#1A1A1A",
              colorBackground: "#FFFFFF",
              colorDanger: "#D32F2F",
              borderRadius: "8px",
              fontFamily: "inherit",
            },
            elements: {
              cardBox: "shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#D9DCE3] rounded-[16px] m-0",
              card: "bg-[#FFFFFF] rounded-[16px]",
              headerTitle: "text-[24px] font-bold tracking-tight text-[#1A1A1A]",
              headerSubtitle: "text-[15px] text-[#1A1A1A]/60",
              socialButtonsBlockButton: "border border-[#D9DCE3] bg-[#FFFFFF] hover:bg-[#F8F9FC] text-[#1A1A1A] h-11 transition-colors",
              socialButtonsBlockButtonText: "font-medium text-[#1A1A1A]",
              formButtonPrimary: "bg-[#3A5FCD] hover:bg-[#6D7BE0] h-11 text-[15px] font-medium shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all",
              formFieldInput: "bg-[#F8F9FC] border border-[#D9DCE3] text-[#1A1A1A] h-11 rounded-[8px] focus:ring-[#3A5FCD]",
              formFieldLabel: "text-[13px] font-semibold text-[#1A1A1A]/70 mb-1.5",
              footerActionLink: "text-[#3A5FCD] hover:text-[#6D7BE0] font-medium transition-colors",
              footerActionText: "text-[#1A1A1A]/60",
              dividerLine: "bg-[#D9DCE3]",
              dividerText: "text-[#1A1A1A]/50 font-medium",
              identityPreview: "border border-[#D9DCE3] bg-[#F8F9FC] rounded-[8px]",
              identityPreviewText: "text-[#1A1A1A]",
              identityPreviewEditButtonIcon: "text-[#3A5FCD]",
              formFieldWarningText: "text-[#D32F2F]",
            },
          }}
        />
      </div>
    </div>
  );
}
