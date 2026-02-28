"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

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
      router.push("/creator");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message ?? "Validation error");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your idea a compelling title..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="teaserText">Teaser Text</Label>
        <Textarea
          id="teaserText"
          value={teaserText}
          onChange={(e) => setTeaserText(e.target.value)}
          placeholder="What can buyers expect? (Don't reveal too much!)"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Optional. Visible to everyone before purchase.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Teaser Image</Label>
        {teaserImageUrl && (
          <div className="mb-2">
            <Image
              src={teaserImageUrl}
              alt="Teaser"
              width={200}
              height={150}
              className="rounded-lg object-cover"
            />
          </div>
        )}
        <UploadButton
          endpoint="teaserImageUploader"
          onClientUploadComplete={(res) => {
            if (res[0]?.url) setTeaserImageUrl(res[0].url);
          }}
          onUploadError={(error: Error) => setError(error.message)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hiddenContent">Hidden Content *</Label>
        <Textarea
          id="hiddenContent"
          value={hiddenContent}
          onChange={(e) => setHiddenContent(e.target.value)}
          placeholder="Your full idea — only visible after purchase..."
          rows={8}
          required
        />
        <p className="text-xs text-muted-foreground">
          This is what buyers pay to see. Be detailed and valuable.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0.99"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            placeholder="9.99"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unlockType">Unlock Type *</Label>
          <select
            id="unlockType"
            value={unlockType}
            onChange={(e) =>
              setUnlockType(e.target.value as "EXCLUSIVE" | "MULTI")
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="MULTI">Multi-unlock (anyone can buy)</option>
            <option value="EXCLUSIVE">Exclusive (first buyer only)</option>
          </select>
        </div>
      </div>

      {unlockType === "MULTI" && (
        <div className="space-y-2">
          <Label htmlFor="maxUnlocks">Max Unlocks</Label>
          <Input
            id="maxUnlocks"
            type="number"
            min="1"
            value={maxUnlocks}
            onChange={(e) => setMaxUnlocks(e.target.value)}
            placeholder="Leave empty for unlimited"
          />
          <p className="text-xs text-muted-foreground">
            Optional. Leave empty for unlimited buyers.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Business, Tech, Life"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="startup, growth, marketing"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated tags.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/creator")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
