"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { ImagePlus, Link2, Lock, Eye, EyeOff, FileText as FileTextIcon, Type, Upload, Wallet, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { CATEGORIES, IDEA_MATURITY_LEVELS, getSubcategoriesByCategory } from "@/lib/constants";
import { createIdeaSchema } from "@/features/ideas/schemas";
import { getIdeaQualityItems, getPublishValidationIssues } from "@/features/ideas/lib/quality";

export type IdeaFormData = z.infer<typeof createIdeaSchema>;

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
  const [hiddenContentType, setHiddenContentType] = useState<"TEXT" | "FILE" | "LINK">(
    (initialData?.hiddenContentType as "TEXT" | "FILE" | "LINK") ?? "TEXT"
  );
  const [hiddenFileUrl, setHiddenFileUrl] = useState(initialData?.hiddenFileUrl ?? "");
  const [hiddenLinkUrl, setHiddenLinkUrl] = useState(initialData?.hiddenLinkUrl ?? "");
  const [originalityConfirmed, setOriginalityConfirmed] = useState(
    initialData?.originalityConfirmed ?? false
  );
  const [whatYoullGet, setWhatYoullGet] = useState(
    initialData?.whatYoullGet ?? ""
  );
  const [bestFitFor, setBestFitFor] = useState(initialData?.bestFitFor ?? "");
  const [implementationNotes, setImplementationNotes] = useState(
    initialData?.implementationNotes ?? ""
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

  const qualityItems = useMemo(() => {
    const parsedPrice = Math.round((parseFloat(priceStr) || 0) * 100);
    return getIdeaQualityItems({
      title,
      teaserText,
      teaserImageUrl,
      hiddenContent,
      hiddenContentType,
      hiddenFileUrl,
      hiddenLinkUrl,
      category,
      priceInCents: parsedPrice,
      originalityConfirmed,
      whatYoullGet,
      bestFitFor,
      implementationNotes,
    });
  }, [
    title,
    teaserText,
    teaserImageUrl,
    hiddenContent,
    hiddenContentType,
    hiddenFileUrl,
    hiddenLinkUrl,
    category,
    priceStr,
    originalityConfirmed,
    whatYoullGet,
    bestFitFor,
    implementationNotes,
  ]);

  const qualityScore = qualityItems.filter((i) => i.met).length;
  const qualityPercent = Math.round((qualityScore / qualityItems.length) * 100);
  const qualityColor =
    qualityScore <= 2 ? "#EF4444" : qualityScore <= 4 ? "#F59E0B" : "#10B981";
  const publishIssues = useMemo(
    () =>
      getPublishValidationIssues({
        title,
        teaserText,
        hiddenContent,
        hiddenContentType,
        hiddenFileUrl,
        hiddenLinkUrl,
        category,
        originalityConfirmed,
        whatYoullGet,
        bestFitFor,
        implementationNotes,
      }),
    [
      title,
      teaserText,
      hiddenContent,
      hiddenContentType,
      hiddenFileUrl,
      hiddenLinkUrl,
      category,
      originalityConfirmed,
      whatYoullGet,
      bestFitFor,
      implementationNotes,
    ]
  );
  const canPublish = publishIssues.length === 0;

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

      const data = createIdeaSchema.parse({
        title,
        teaserText: teaserText || undefined,
        teaserImageUrl: teaserImageUrl || undefined,
        hiddenContentType,
        hiddenContent: hiddenContentType === "TEXT" ? hiddenContent : (hiddenContent || undefined),
        hiddenFileUrl: hiddenFileUrl || undefined,
        hiddenLinkUrl: hiddenLinkUrl || undefined,
        originalityConfirmed,
        whatYoullGet: whatYoullGet || undefined,
        bestFitFor: bestFitFor || undefined,
        implementationNotes: implementationNotes || undefined,
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
    "w-full rounded-[8px] border border-border bg-muted px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)]";

  const textareaClasses = `${inputClasses} resize-none`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Wallet-first info banner — only shown in create mode */}
      {isCreateMode && (
        <div className="flex items-start gap-3 rounded-[8px] border border-primary/20 bg-primary/5 px-4 py-3 text-[14px] text-primary">
          <Wallet className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            No payout setup required to publish.{" "}
            <span className="text-foreground/70">
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
      <div className="rounded-[8px] border border-border bg-muted p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-foreground">Listing quality</p>
          <span
            className="text-[13px] font-bold"
            style={{ color: qualityColor }}
          >
            {qualityPercent}%
          </span>
        </div>
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
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
                <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              )}
              <span
                className={`text-[12px] leading-snug ${
                  item.met ? "text-foreground/70" : "text-muted-foreground"
                }`}
              >
                {item.label}
                {!item.met && (
                  <span className="block text-[11px] text-muted-foreground/60">{item.hint}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        {publishIssues.length > 0 && (
          <div className="mt-4 rounded-[8px] border border-amber-500/20 bg-amber-500/5 px-3 py-2">
            <p className="text-[12px] font-semibold text-foreground">
              Publish checklist
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Complete the essentials below before this idea can go live.
            </p>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label
          htmlFor="title"
          className="text-[14px] font-semibold text-foreground"
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
          className="text-[14px] font-semibold text-foreground"
        >
          Teaser Text{" "}
          <span className="text-[12px] font-normal text-muted-foreground">
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
          <p className="text-[12px] text-muted-foreground/70">
            <AlertCircle className="mb-0.5 mr-1 inline h-3 w-3" />
            Lead with the problem, outcome, and why it matters — keep the exact method locked
          </p>
          <p className="shrink-0 text-[12px] text-muted-foreground/70">
            {teaserText.length}/500
          </p>
        </div>
      </div>

      {/* Teaser Image */}
      <div className="space-y-2">
        <Label className="text-[14px] font-semibold text-foreground">
          Teaser Image{" "}
          <span className="text-[12px] font-normal text-muted-foreground">
            — optional preview image
          </span>
        </Label>
        {teaserImageUrl ? (
          <div className="relative overflow-hidden rounded-[8px] border border-border bg-muted">
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
              className="absolute right-2 top-2 rounded-[6px] border border-border bg-card/90 px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-[8px] border-2 border-dashed border-border bg-muted p-8">
            <div className="text-center">
              <ImagePlus className="mx-auto mb-3 h-8 w-8 text-foreground/20" />
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
          htmlFor={hiddenContentType === "TEXT" ? "hiddenContent" : hiddenContentType === "LINK" ? "hiddenLinkUrl" : undefined}
          className="text-[14px] font-semibold text-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Hidden Content <span className="text-red-500">*</span>
          </span>{" "}
          <span className="text-[12px] font-normal text-muted-foreground">
            — only visible after purchase
          </span>
        </Label>

        {/* Mode switcher */}
        <div className="flex gap-1 rounded-[8px] border border-border bg-muted p-1">
          {(
            [
              { value: "TEXT", icon: Type, label: "Text" },
              { value: "FILE", icon: Upload, label: "File" },
              { value: "LINK", icon: Link2, label: "Link" },
            ] as const
          ).map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setHiddenContentType(value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-[6px] px-3 py-2 text-[13px] font-medium transition-all ${
                hiddenContentType === value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Text mode */}
        {hiddenContentType === "TEXT" && (
          <>
            <textarea
              id="hiddenContent"
              value={hiddenContent}
              onChange={(e) => setHiddenContent(e.target.value)}
              placeholder="Share your full insight, methodology, or secret here. Be specific and actionable — buyers pay for results, not vague advice. The more concrete and original, the better."
              rows={8}
              className={textareaClasses}
            />
            <p className="text-[12px] text-muted-foreground/70">
              {hiddenContent.length < 150 && (
                <span className="text-amber-500">
                  Add {150 - hiddenContent.length} more characters for a quality listing ·{" "}
                </span>
              )}
              {hiddenContent.length} characters · include the full insight, specifics, and what makes it usable
            </p>
          </>
        )}

        {/* File mode */}
        {hiddenContentType === "FILE" && (
          <div className="space-y-3">
            {hiddenFileUrl ? (
              <div className="flex items-center justify-between rounded-[8px] border border-border bg-muted px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileTextIcon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate text-[13px] text-foreground">
                    {hiddenFileUrl.split("/").pop() ?? "Uploaded file"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHiddenFileUrl("")}
                  className="ml-3 shrink-0 rounded-[6px] border border-border bg-card/90 px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-[8px] border-2 border-dashed border-border bg-muted p-8">
                <div className="text-center">
                  <Upload className="mx-auto mb-3 h-8 w-8 text-foreground/20" />
                  <UploadButton
                    endpoint="hiddenFileUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) setHiddenFileUrl(res[0].url);
                    }}
                    onUploadError={(err) => { toast.error(err.message); }}
                  />
                </div>
              </div>
            )}
            <p className="text-[12px] text-muted-foreground/70">
              Supported: PDF, images, ZIP, DOCX · Max 32 MB · 1 file
            </p>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground/70">
                Optional note to buyer
              </label>
              <textarea
                value={hiddenContent}
                onChange={(e) => setHiddenContent(e.target.value)}
                placeholder="Add any instructions or context for the buyer — e.g. 'Open in Adobe Acrobat for best results.'"
                rows={3}
                className={textareaClasses}
              />
            </div>
          </div>
        )}

        {/* Link mode */}
        {hiddenContentType === "LINK" && (
          <div className="space-y-3">
            <input
              id="hiddenLinkUrl"
              type="url"
              value={hiddenLinkUrl}
              onChange={(e) => setHiddenLinkUrl(e.target.value)}
              placeholder="e.g. https://www.notion.so/your-page or a private Google Doc link"
              className={inputClasses}
            />
            <p className="text-[12px] text-muted-foreground/70">
              Make sure the link is accessible to the buyer — test it in an incognito window.
            </p>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground/70">
                Optional note to buyer
              </label>
              <textarea
                value={hiddenContent}
                onChange={(e) => setHiddenContent(e.target.value)}
                placeholder="Add any context — e.g. 'Request access with your purchase email.'"
                rows={3}
                className={textareaClasses}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="whatYoullGet" className="text-[14px] font-semibold text-foreground">
            What you&apos;ll get
          </Label>
          <textarea
            id="whatYoullGet"
            value={whatYoullGet}
            onChange={(e) => setWhatYoullGet(e.target.value)}
            placeholder="Examples: market angle, positioning, execution plan, prompts, templates."
            rows={4}
            maxLength={400}
            className={textareaClasses}
          />
          <p className="text-[12px] text-muted-foreground/70">
            Public preview. Keep it specific enough to build confidence.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bestFitFor" className="text-[14px] font-semibold text-foreground">
            Best fit for
          </Label>
          <textarea
            id="bestFitFor"
            value={bestFitFor}
            onChange={(e) => setBestFitFor(e.target.value)}
            placeholder="Who should buy this: founder stage, team type, channel, or use case."
            rows={4}
            maxLength={280}
            className={textareaClasses}
          />
          <p className="text-[12px] text-muted-foreground/70">
            Helps the right buyers self-select faster.
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="implementationNotes"
            className="text-[14px] font-semibold text-foreground"
          >
            Risks / notes
          </Label>
          <textarea
            id="implementationNotes"
            value={implementationNotes}
            onChange={(e) => setImplementationNotes(e.target.value)}
            placeholder="Call out dependencies, effort level, or assumptions before someone buys."
            rows={4}
            maxLength={400}
            className={textareaClasses}
          />
          <p className="text-[12px] text-muted-foreground/70">
            Concise expectation-setting builds trust and reduces refund requests.
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label
          htmlFor="price"
          className="text-[14px] font-semibold text-foreground"
        >
          Price (USD) <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground">
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
        <p className="text-[12px] text-muted-foreground/70">
          Minimum $0.99 · Maximum $1,000.00 ·{" "}
          <span className="text-primary">Price for the clarity and usefulness of the full write-up</span>
        </p>
      </div>

      {/* Unlock Type */}
      <div className="space-y-3">
        <Label className="text-[14px] font-semibold text-foreground">
          Unlock Type <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-[8px] border p-4 transition-all ${
              unlockType === "MULTI"
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border bg-muted hover:border-primary/40"
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
              <p className="text-[14px] font-semibold text-foreground">
                Multi-unlock
              </p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                Unlimited buyers — maximise reach and passive income
              </p>
            </div>
          </label>
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-[8px] border p-4 transition-all ${
              unlockType === "EXCLUSIVE"
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border bg-muted hover:border-primary/40"
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
              <p className="text-[14px] font-semibold text-foreground">
                Exclusive
              </p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                One buyer only — commands a premium price point
              </p>
            </div>
          </label>
        </div>
        <p className="text-[12px] text-muted-foreground/70">
          Exclusive closes the listing after a successful unlock. Multi-unlock keeps the idea available to multiple buyers.
        </p>
        {unlockType === "MULTI" && (
          <div className="mt-2 space-y-2">
            <Label
              htmlFor="maxUnlocks"
              className="text-[14px] font-medium text-foreground/70"
            >
              Max Unlocks{" "}
              <span className="text-[12px] font-normal text-muted-foreground">
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
          className="text-[14px] font-semibold text-foreground"
        >
          Category <span className="text-red-500">*</span>
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
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70"
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
        <p className="text-[12px] text-muted-foreground/70">
          Pick the closest category so related ideas and buyer recommendations stay relevant.
        </p>
      </div>

      {/* Subcategory — only shown when a category with subcategories is selected */}
      {availableSubcategories.length > 0 && (
        <div className="space-y-2">
          <Label
            htmlFor="subcategory"
            className="text-[14px] font-semibold text-foreground"
          >
            Subcategory{" "}
            <span className="text-[12px] font-normal text-muted-foreground">
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
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70"
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
          <p className="text-[12px] text-muted-foreground/70">
            Choose the narrowest fit when available for better discovery quality.
          </p>
        </div>
      )}

      {/* Maturity Level */}
      <div className="space-y-2">
        <Label
          htmlFor="maturityLevel"
          className="text-[14px] font-semibold text-foreground"
        >
          Maturity Level{" "}
          <span className="text-[12px] font-normal text-muted-foreground">
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
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70"
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
          className="text-[14px] font-semibold text-foreground"
        >
          Tags{" "}
          <span className="text-[12px] font-normal text-muted-foreground">
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
        <p className="text-[12px] text-muted-foreground/70">
          Use 3–5 buyer-facing keywords rather than internal jargon.
        </p>
      </div>

      <div className="rounded-[8px] border border-border bg-muted p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={originalityConfirmed}
            onChange={(e) => setOriginalityConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded accent-[#3A5FCD]"
          />
          <div>
            <p className="text-[14px] font-semibold text-foreground">
              Originality attestation <span className="text-red-500">*</span>
            </p>
            <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
              I confirm this listing is my original work or that I have the right to share it here.
              MysteryMarket can show a small public trust signal based on this attestation. This is not a legal guarantee.
            </p>
          </div>
        </label>
      </div>

      {/* Publish toggle — only shown in create mode */}
      {isCreateMode && (
        <div className="rounded-[8px] border border-border bg-muted p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => setPublishNow(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-[#3A5FCD]"
            />
            <div>
              <p className="text-[14px] font-semibold text-foreground">
                {publishNow ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-primary" />
                    Publish immediately
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <EyeOff className="h-4 w-4 text-muted-foreground/70" />
                    Save as draft
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {publishNow
                  ? "Your idea will be visible in the marketplace right away."
                  : "Your idea will be saved privately. You can publish it later from Creator Studio."}
              </p>
              {publishNow && !canPublish && (
                <p className="mt-2 text-[12px] text-amber-500">
                  Finish the publish checklist above before you can go live.
                </p>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Submit / Cancel */}
      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
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
          disabled={isSubmitting || (isCreateMode && publishNow && !canPublish)}
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
