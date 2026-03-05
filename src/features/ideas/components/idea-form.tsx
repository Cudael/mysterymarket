"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { ImagePlus, Info, Lock } from "lucide-react";

const ideaFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  teaserText: z.string().max(500).optional(),
  teaserImageUrl: z.string().url().optional().or(z.literal("")),
  hiddenContent: z
    .string()
    .min(10, "Hidden content must be at least 10 characters"),
  priceInCents: z.number().int().min(99, "Minimum price is $0.99").max(100000),
  unlockType: z.enum(["EXCLUSIVE", "MULTI"]),
  maxUnlocks: z.number().int().min(1).optional().nullable(),
  category: z.string().max(50).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export type IdeaFormData = z.infer<typeof ideaFormSchema>;

interface IdeaFormProps {
  initialData?: Partial<IdeaFormData>;
  onSubmit: (data: IdeaFormData) => Promise<unknown>;
  submitLabel?: string;
}

export function IdeaForm({
  initialData,
  onSubmit,
  submitLabel = "Publish Idea",
}: IdeaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [teaserText, setTeaserText] = useState(initialData?.teaserText ?? "");
  const [teaserImageUrl, setTeaserImageUrl] = useState(
    initialData?.teaserImageUrl ?? ""
  );
  const [hiddenContent, setHiddenContent] = useState(
    initialData?.hiddenContent ?? ""
  );
  const [priceStr, setPriceStr] = useState(
    initialData?.priceInCents ? (initialData.priceInCents / 100).toFixed(2) : ""
  );
  const [unlockType, setUnlockType] = useState<"EXCLUSIVE" | "MULTI">(
    initialData?.unlockType ?? "MULTI"
  );
  const [maxUnlocks, setMaxUnlocks] = useState(
    initialData?.maxUnlocks?.toString() ?? ""
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [tagsStr, setTagsStr] = useState(
    initialData?.tags?.join(", ") ?? ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const priceInCents = Math.round(parseFloat(priceStr) * 100);
      const tags = tagsStr
        ? tagsStr
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const data = ideaFormSchema.parse({
        title,
        teaserText: teaserText || undefined,
        teaserImageUrl: teaserImageUrl || undefined,
        hiddenContent,
        priceInCents,
        unlockType,
        maxUnlocks:
          unlockType === "MULTI" && maxUnlocks
            ? parseInt(maxUnlocks)
            : null,
        category: category || undefined,
        tags,
      });

      await onSubmit(data);
      if (submitLabel === "Publish Idea") {
        toast.success("Idea published! 🚀", { description: "It's now visible in the marketplace." });
      } else {
        toast.success("Idea updated!");
      }
      router.push("/creator");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msg = err.errors[0]?.message ?? "Validation error";
        setError(msg);
        toast.error(msg);
      } else if (err instanceof Error && err.message === "STRIPE_NOT_CONNECTED") {
        const msg = "Please connect your Stripe account before creating ideas.";
        setError(msg);
        toast.error(msg, {
          action: {
            label: "Connect Stripe",
            onClick: () => router.push("/creator/connect"),
          },
        });
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("Something went wrong");
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isStripeError = error === "Please connect your Stripe account before creating ideas.";

  const inputClasses = "w-full rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 py-3 text-[15px] text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 outline-none transition-all focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#3A5FCD]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.02)]">
      {/* Rest of your form JSX from your original code */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-[14px] font-semibold text-[#1A1A1A]">Title *</Label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your insight a compelling title..."
          required
          className={inputClasses}
        />
      </div>
      {/* ... */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#D9DCE3]">
        <Button type="submit" size="lg" className="sm:flex-1 h-12 text-[16px]" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
