"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { ImagePlus, Lock, Eye, EyeOff, Wallet, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { CATEGORIES, IDEA_MATURITY_LEVELS, getSubcategoriesByCategory } from "@/lib/constants";

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
  category: z.string().max(100).optional(),
  subcategory: z.string().max(100).optional(),
  maturityLevel: z.enum(["SEED", "CONCEPT", "BLUEPRINT", "PROTOTYPE_READY"]).optional(),
  tags: z.array(z.string()).max(10).optional(),
  published: z.boolean().optional(),
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
  const isCreateMode = submitLabel === "Publish Idea";
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
  const [subcategory, setSubcategory] = useState(initialData?.subcategory ?? "");
  const [maturityLevel, setMaturityLevel] = useState(initialData?.maturityLevel ?? "");
  const [tagsStr, setTagsStr] = useState(
    initialData?.tags?.join(", ") ?? ""
  );
  const [publishNow, setPublishNow] = useState(
    initialData?.published ?? true
  );

  const availableSubcategories = useMemo(() => getSubcategoriesByCategory(category), [category]);

  // Listing quality score (0-5)
  const qualityItems = useMemo(() => {
    const price = parseFloat(priceStr);
    return [
      {
        label: "Compelling title",
        met: title.trim().length >= 10,
        hint: "At least 10 characters",
      },
      {
        label: "Teaser text added",
        met: teaserText.trim().length >= 40,
        hint: "40+ characters builds curiosity",
      },
      {
        label: "Teaser image uploaded",
        met: !!teaserImageUrl,
        hint: "Images increase click-through by 2×",
      },
      {
        label: "Substantial hidden content",
        met: hiddenContent.trim().length >= 150,
        hint: "150+ characters delivers real value",
      },
      {
        label: "Category selected",
        met: !!category,
        hint: "Helps buyers discover your idea",
      },
      {
        label: "Price is set",
        met: !isNaN(price) && price >= 0.99 && price <= 1000,
        hint: "Set a price between $0.99 and $1,000",
      },
    ];
  }, [title, teaserText, teaserImageUrl, hiddenContent, category, priceStr]);

  const qualityScore = qualityItems.filter((i) => i.met).length;
  const qualityPercent = Math.round((qualityScore / qualityItems.length) * 100);
  const qualityColor =
    qualityScore <= 2 ? "#EF4444" : qualityScore <= 4 ? "#F59E0B" : "#10B981";

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
        subcategory: subcategory || undefined,
        maturityLevel: (maturityLevel || undefined) as "SEED" | "CONCEPT" | "BLUEPRINT" | "PROTOTYPE_READY" | undefined,
        tags,
        published: isCreateMode ? publishNow : undefined,
      });

      await onSubmit(data);
      if (isCreateMode) {
        if (publishNow) {
          toast.success("Idea published! 🚀", {
            description: "It's now visible in the marketplace.",
          });
        } else {
          toast.success("Draft saved.", {
            description: "You can publish it later from Creator Studio.",
          });
        }
      } else {
        toast.success("Idea updated!");
      }
      router.push("/creator");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msg = err.errors[0]?.message ?? "Validation error";
        setError(msg);
        toast.error(msg);
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

  const inputClasses =
    "w-full rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 py-3 text-[15px] text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 outline-none transition-all focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#3A5FCD]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)]";

  const textareaClasses = `${inputClasses} resize-none`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Wallet-first info banner — only shown in create mode */}
      {isCreateMode && (
        <div className="flex items-start gap-3 rounded-[8px] border border-[#3A5FCD]/20 bg-[#3A5FCD]/5 px-4 py-3 text-[14px] text-[#3A5FCD]">
          <Wallet className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            No payout setup required to publish.{" "}
            <span className="text-[#1A1A1A]/70">
              Earnings go straight to your in-app wallet. Connect Stripe later when you&apos;re ready to withdraw.
            </span>
          </p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {error}
        </div>
      )}

      {/* Listing Quality Checklist */}
      <div className="rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-[#1A1A1A]">Listing quality</p>
          <span
            className="text-[13px] font-bold"
            style={{ color: qualityColor }}
          >
            {qualityPercent}%
          </span>
        </div>
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[#D9DCE3]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${qualityPercent}%`, backgroundColor: qualityColor }}
          />
        </div>
        <ul className="space-y-1.5">
          {qualityItems.map((item) => (
            <li key={item.label} className="flex items-start gap-2">
              {item.met ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              ) : (
                <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1A1A1A]/25" />
              )}
              <span
                className={`text-[12px] leading-snug ${
                  item.met ? "text-[#1A1A1A]/70" : "text-[#1A1A1A]/45"
                }`}
              >
                {item.label}
                {!item.met && (
                  <span className="block text-[11px] text-[#1A1A1A]/35">{item.hint}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label
          htmlFor="title"
          className="text-[14px] font-semibold text-[#1A1A1A]"
        >
          Title <span className="text-red-500">*</span>
        </Label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your insight a compelling title..."
          required
          className={inputClasses}
        />
      </div>

      {/* Teaser Text */}
      <div className="space-y-2">
        <Label
          htmlFor="teaserText"
          className="text-[14px] font-semibold text-[#1A1A1A]"
        >
          Teaser Text{" "}
          <span className="text-[12px] font-normal text-[#1A1A1A]/50">
            — visible to everyone before purchase
          </span>
        </Label>
        <textarea
          id="teaserText"
          value={teaserText}
          onChange={(e) => setTeaserText(e.target.value)}
          placeholder="Hook buyers in 1–3 sentences. Hint at the value without giving away the secret — e.g. 'The exact cold-email template I used to land 3 enterprise clients in 30 days.'"
          rows={3}
          maxLength={500}
          className={textareaClasses}
        />
        <div className="flex items-start justify-between gap-2">
          <p className="text-[12px] text-[#1A1A1A]/40">
            <AlertCircle className="mb-0.5 mr-1 inline h-3 w-3" />
            Great teasers create curiosity without revealing the answer
          </p>
          <p className="shrink-0 text-[12px] text-[#1A1A1A]/40">
            {teaserText.length}/500
          </p>
        </div>
      </div>

      {/* Teaser Image */}
      <div className="space-y-2">
        <Label className="text-[14px] font-semibold text-[#1A1A1A]">
          Teaser Image{" "}
          <span className="text-[12px] font-normal text-[#1A1A1A]/50">
            — optional preview image
          </span>
        </Label>
        {teaserImageUrl ? (
          <div className="relative overflow-hidden rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC]">
            <Image
              src={teaserImageUrl}
              alt="Teaser preview"
              width={600}
              height={300}
              className="max-h-[240px] w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setTeaserImageUrl("")}
              className="absolute right-2 top-2 rounded-[6px] border border-[#D9DCE3] bg-[#FFFFFF]/90 px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A] transition-colors hover:bg-[#F8F9FC]"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-[8px] border-2 border-dashed border-[#D9DCE3] bg-[#F8F9FC] p-8">
            <div className="text-center">
              <ImagePlus className="mx-auto mb-3 h-8 w-8 text-[#1A1A1A]/20" />
              <UploadButton
                endpoint="teaserImageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.url) setTeaserImageUrl(res[0].url);
                }}
                onUploadError={(err) => { toast.error(err.message); }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hidden Content */}
      <div className="space-y-2">
        <Label
          htmlFor="hiddenContent"
          className="text-[14px] font-semibold text-[#1A1A1A]"
        >
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Hidden Content <span className="text-red-500">*</span>
          </span>{" "}
          <span className="text-[12px] font-normal text-[#1A1A1A]/50">
            — only visible after purchase
          </span>
        </Label>
        <textarea
          id="hiddenContent"
          value={hiddenContent}
          onChange={(e) => setHiddenContent(e.target.value)}
          placeholder="Share your full insight, methodology, or secret here. Be specific and actionable — buyers pay for results, not vague advice. The more concrete and original, the better."
          rows={8}
          required
          className={textareaClasses}
        />
        <p className="text-[12px] text-[#1A1A1A]/40">
          {hiddenContent.length < 150 && (
            <span className="text-amber-500">
              Add {150 - hiddenContent.length} more characters for a quality listing ·{" "}
            </span>
          )}
          {hiddenContent.length} characters
        </p>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label
          htmlFor="price"
          className="text-[14px] font-semibold text-[#1A1A1A]"
        >
          Price (USD) <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#1A1A1A]/50">
            $
          </span>
          <input
            id="price"
            type="number"
            min="0.99"
            max="1000"
            step="0.01"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            placeholder="9.99"
            required
            className={`${inputClasses} pl-8`}
          />
        </div>
        <p className="text-[12px] text-[#1A1A1A]/40">
          Minimum $0.99 · Maximum $1,000.00 ·{" "}
          <span className="text-[#3A5FCD]">$5–$49 converts best for most ideas</span>
        </p>
      </div>

      {/* Unlock Type */}
      <div className="space-y-3">
        <Label className="text-[14px] font-semibold text-[#1A1A1A]">
          Unlock Type <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-[8px] border p-4 transition-all ${
              unlockType === "MULTI"
                ? "border-[#3A5FCD] bg-[#3A5FCD]/5 ring-1 ring-[#3A5FCD]/20"
                : "border-[#D9DCE3] bg-[#F8F9FC] hover:border-[#3A5FCD]/40"
            }`}
          >
            <input
              type="radio"
              name="unlockType"
              value="MULTI"
              checked={unlockType === "MULTI"}
              onChange={() => setUnlockType("MULTI")}
              className="mt-0.5 accent-[#3A5FCD]"
            />
            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">
                Multi-unlock
              </p>
              <p className="mt-0.5 text-[13px] text-[#1A1A1A]/60">
                Unlimited buyers — maximise reach and passive income
              </p>
            </div>
          </label>
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-[8px] border p-4 transition-all ${
              unlockType === "EXCLUSIVE"
                ? "border-[#3A5FCD] bg-[#3A5FCD]/5 ring-1 ring-[#3A5FCD]/20"
                : "border-[#D9DCE3] bg-[#F8F9FC] hover:border-[#3A5FCD]/40"
            }`}
          >
            <input
              type="radio"
              name="unlockType"
              value="EXCLUSIVE"
              checked={unlockType === "EXCLUSIVE"}
              onChange={() => setUnlockType("EXCLUSIVE")}
              className="mt-0.5 accent-[#3A5FCD]"
            />
            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">
                Exclusive
              </p>
              <p className="mt-0.5 text-[13px] text-[#1A1A1A]/60">
                One buyer only — commands a premium price point
              </p>
            </div>
          </label>
        </div>
        {unlockType === "MULTI" && (
          <div className="mt-2 space-y-2">
            <Label
              htmlFor="maxUnlocks"
              className="text-[14px] font-medium text-[#1A1A1A]/70"
            >
              Max Unlocks{" "}
              <span className="text-[12px] font-normal text-[#1A1A1A]/50">
                — leave blank for unlimited
              </span>
            </Label>
            <input
              id="maxUnlocks"
              type="number"
              min="1"
              value={maxUnlocks}
              onChange={(e) => setMaxUnlocks(e.target.value)}
              placeholder="e.g. 50"
              className={inputClasses}
            />
          </div>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label
          htmlFor="category"
          className="text-[14px] font-semibold text-[#1A1A1A]"
        >
          Category
        </Label>
        <div className="relative">
          <select
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory("");
            }}
            className={`${inputClasses} cursor-pointer appearance-none pr-10`}
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Subcategory — only shown when a category with subcategories is selected */}
      {availableSubcategories.length > 0 && (
        <div className="space-y-2">
          <Label
            htmlFor="subcategory"
            className="text-[14px] font-semibold text-[#1A1A1A]"
          >
            Subcategory{" "}
            <span className="text-[12px] font-normal text-[#1A1A1A]/50">
              — optional
            </span>
          </Label>
          <div className="relative">
            <select
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className={`${inputClasses} cursor-pointer appearance-none pr-10`}
            >
              <option value="">Select a subcategory...</option>
              {availableSubcategories.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Maturity Level */}
      <div className="space-y-2">
        <Label
          htmlFor="maturityLevel"
          className="text-[14px] font-semibold text-[#1A1A1A]"
        >
          Maturity Level{" "}
          <span className="text-[12px] font-normal text-[#1A1A1A]/50">
            — optional
          </span>
        </Label>
        <div className="relative">
          <select
            id="maturityLevel"
            value={maturityLevel}
            onChange={(e) => setMaturityLevel(e.target.value)}
            className={`${inputClasses} cursor-pointer appearance-none pr-10`}
          >
            <option value="">Select maturity level...</option>
            {IDEA_MATURITY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label} — {level.description}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label
          htmlFor="tags"
          className="text-[14px] font-semibold text-[#1A1A1A]"
        >
          Tags{" "}
          <span className="text-[12px] font-normal text-[#1A1A1A]/50">
            — comma-separated, up to 10
          </span>
        </Label>
        <input
          id="tags"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          placeholder="e.g. startup, growth, SaaS"
          className={inputClasses}
        />
      </div>

      {/* Publish toggle — only shown in create mode */}
      {isCreateMode && (
        <div className="rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => setPublishNow(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-[#3A5FCD]"
            />
            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">
                {publishNow ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-[#3A5FCD]" />
                    Publish immediately
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <EyeOff className="h-4 w-4 text-[#1A1A1A]/40" />
                    Save as draft
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-[13px] text-[#1A1A1A]/60">
                {publishNow
                  ? "Your idea will be visible in the marketplace right away."
                  : "Your idea will be saved privately. You can publish it later from Creator Studio."}
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Submit / Cancel */}
      <div className="flex flex-col gap-3 border-t border-[#D9DCE3] pt-6 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 text-[15px] sm:w-auto"
          onClick={() => router.push("/creator")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          className="h-12 text-[16px] sm:flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isCreateMode
              ? publishNow
                ? "Publish Idea"
                : "Save as Draft"
              : submitLabel}
        </Button>
      </div>
    </form>
  );
}
