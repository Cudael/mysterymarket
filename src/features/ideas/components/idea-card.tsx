"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      toast.success(submitLabel === "Publish Idea" ? "Idea published!" : "Idea updated!");
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

  // Shared classes for all inputs based on the design system
  const inputClasses = "w-full rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 py-3 text-[15px] text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 outline-none transition-all focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#3A5FCD]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.02)]">
      
      {isStripeError ? (
        <div className="rounded-[8px] border border-yellow-400/50 bg-yellow-50 p-4 text-sm text-yellow-800">
          {error}{" "}
          <Link href="/creator/connect" className="font-medium underline hover:text-yellow-900 transition-colors">
            Set up Stripe Connect →
          </Link>
        </div>
      ) : error ? (
        <div className="rounded-[8px] border border-destructive/50 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      ) : null}

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

      <div className="space-y-2">
        <Label htmlFor="teaserText" className="text-[14px] font-semibold text-[#1A1A1A]">Teaser Text</Label>
        <textarea
          id="teaserText"
          value={teaserText}
          onChange={(e) => setTeaserText(e.target.value)}
          placeholder="What can buyers expect? (Don't reveal too much!)"
          rows={3}
          className={`${inputClasses} resize-y min-h-[100px]`}
        />
        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#1A1A1A]/60">
          <Info className="h-3.5 w-3.5" />
          <span>Optional. Visible to everyone before purchase.</span>
        </div>
      </div>

      <div className="space-y-3 rounded-[8px] border border-[#D9DCE3] bg-[#F5F6FA] p-5">
        <Label className="text-[14px] font-semibold text-[#1A1A1A]">Teaser Image</Label>
        <p className="text-sm text-[#1A1A1A]/60">Add a visual hook to make your idea stand out in the marketplace.</p>
        
        {teaserImageUrl ? (
          <div className="relative mt-3 group overflow-hidden rounded-[8px] border border-[#D9DCE3] w-fit">
            <Image
              src={teaserImageUrl}
              alt="Teaser"
              width={240}
              height={160}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#1A1A1A]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <UploadButton
                endpoint="teaserImageUploader"
                onClientUploadComplete={(res) => {
                  if (res[0]?.url) setTeaserImageUrl(res[0].url);
                }}
                onUploadError={(error: Error) => setError(error.message)}
                appearance={{
                  button: "bg-transparent text-white font-medium text-sm border border-white/50 hover:bg-white/20 px-3 py-1.5 rounded-[6px]",
                  allowedContent: "hidden"
                }}
                content={{
                  button({ ready }) {
                    if (ready) return <div>Replace Image</div>;
                    return "Loading...";
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-4 rounded-[8px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF] p-6 transition-colors hover:border-[#3A5FCD]/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F8F9FC]">
              <ImagePlus className="h-5 w-5 text-[#3A5FCD]" />
            </div>
            <div className="w-full text-left">
              <UploadButton
                endpoint="teaserImageUploader"
                onClientUploadComplete={(res) => {
                  if (res[0]?.url) setTeaserImageUrl(res[0].url);
                }}
                onUploadError={(error: Error) => setError(error.message)}
                appearance={{
                  button: "bg-[#FFFFFF] text-[#1A1A1A] font-medium text-[14px] border border-[#D9DCE3] hover:border-[#3A5FCD] hover:bg-[#F8F9FC] transition-colors rounded-[8px] h-10 px-4 w-full sm:w-auto shadow-[0_2px_8px_rgba(0,0,0,0.02)]",
                  allowedContent: "text-xs text-[#1A1A1A]/50 mt-2"
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#3A5FCD]" />
          <Label htmlFor="hiddenContent" className="text-[14px] font-semibold text-[#1A1A1A]">Hidden Content *</Label>
        </div>
        <textarea
          id="hiddenContent"
          value={hiddenContent}
          onChange={(e) => setHiddenContent(e.target.value)}
          placeholder="Type or paste your highly valuable insight here. This remains locked until purchased."
          rows={10}
          required
          className={`${inputClasses} font-mono text-[14px] resize-y min-h-[200px] leading-relaxed`}
        />
        <p className="text-xs font-medium text-[#3A5FCD] mt-1">
          This content is encrypted and completely hidden from public view.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#D9DCE3]">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-[14px] font-semibold text-[#1A1A1A]">Price (USD) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/50 font-medium">$</span>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.99"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              placeholder="9.99"
              required
              className={`${inputClasses} pl-8`}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unlockType" className="text-[14px] font-semibold text-[#1A1A1A]">Unlock Model *</Label>
          <select
            id="unlockType"
            value={unlockType}
            onChange={(e) =>
              setUnlockType(e.target.value as "EXCLUSIVE" | "MULTI")
            }
            className={`${inputClasses} cursor-pointer appearance-none`}
          >
            <option value="MULTI">Multi-unlock (unlimited buyers)</option>
            <option value="EXCLUSIVE">Exclusive (one buyer only)</option>
          </select>
        </div>
      </div>

      {unlockType === "MULTI" && (
        <div className="space-y-2">
          <Label htmlFor="maxUnlocks" className="text-[14px] font-semibold text-[#1A1A1A]">Max Unlocks (Optional)</Label>
          <input
            id="maxUnlocks"
            type="number"
            min="1"
            value={maxUnlocks}
            onChange={(e) => setMaxUnlocks(e.target.value)}
            placeholder="Leave empty for unlimited sales"
            className={inputClasses}
          />
          <p className="text-xs text-[#1A1A1A]/60 mt-1">
            Creates artificial scarcity by limiting total available copies.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-[14px] font-semibold text-[#1A1A1A]">Category</Label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. SaaS, Marketing, Code"
            className={inputClasses}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-[14px] font-semibold text-[#1A1A1A]">Tags</Label>
          <input
            id="tags"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="growth, startup, seo (comma separated)"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#D9DCE3]">
        <Button type="submit" size="lg" className="sm:flex-1 h-12 text-[16px]" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 text-[16px] bg-[#FFFFFF]"
          onClick={() => router.push("/creator")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
