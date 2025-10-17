"use client";

import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUp, Image as ImageIcon, Loader2, Wand2 } from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";

import { SumitSteps } from "@/components/SumitSteps";
import { MarkdownEditor } from "@/components/markdown-editor";
import { MultiSelect } from "@/components/multi-select";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEFAULT_CATEGORIES, DEFAULT_TAGS } from "@/lib/fallback-data";
import { cn, normalizeExternalUrl } from "@/lib/utils";

type SubmitErrors = {
  link?: string;
  name?: string;
  categories?: string;
  tags?: string;
  description?: string;
  introduction?: string;
  image?: string;
};

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (!session?.user?.id) {
      const callback =
        typeof window !== "undefined" ? window.location.href : "/submit";
      router.replace(`/login?callbackUrl=${encodeURIComponent(callback)}`);
    }
  }, [router, session?.user?.id, status]);

  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] =
    useState<string[]>(DEFAULT_CATEGORIES);
  const [tagOptions, setTagOptions] = useState<string[]>(DEFAULT_TAGS);
  const [showAutofillConfirm, setShowAutofillConfirm] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<SubmitErrors>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFilters = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/tags", { cache: "no-store" }),
        ]);

        if (!isMounted) {
          return;
        }

        if (categoriesResponse.ok) {
          const data = (await categoriesResponse.json()) as {
            categories?: string[];
          };
          if (Array.isArray(data?.categories) && data.categories.length > 0) {
            setCategoryOptions(data.categories);
          }
        }

        if (tagsResponse.ok) {
          const data = (await tagsResponse.json()) as {
            tags?: string[];
          };
          if (Array.isArray(data?.tags) && data.tags.length > 0) {
            setTagOptions(data.tags);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load filter data", error);
        }
      }
    };

    loadFilters();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedCategories((previous) =>
      previous.filter((item) => categoryOptions.includes(item))
    );
  }, [categoryOptions]);

  useEffect(() => {
    setSelectedTags((previous) =>
      previous.filter((item) => tagOptions.includes(item))
    );
  }, [tagOptions]);

  const isAutofillDisabled = useMemo(
    () => !link.trim() || isAutofilling,
    [link, isAutofilling]
  );

  const ensureAuthenticated = useCallback(() => {
    if (session?.user?.id) {
      return true;
    }
    const callback =
      typeof window !== "undefined" ? window.location.href : "/submit";
    router.push(`/login?callbackUrl=${encodeURIComponent(callback)}`);
    return false;
  }, [router, session?.user?.id]);

  const handleAutofillRequest = () => {
    if (!ensureAuthenticated()) {
      return;
    }
    if (!link.trim()) {
      toast.error("Add your product link before using AI Autofill.");
      return;
    }
    setShowAutofillConfirm(true);
  };

  const clearImage = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setImagePreview(null);
    setImageUrl(null);
    setIsUploadingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors((prev) => ({ ...prev, image: undefined }));
  }, [setErrors]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!ensureAuthenticated()) {
        return;
      }
      const formData = new FormData();
      formData.append("file", file);

      setIsUploadingImage(true);
      try {
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json().catch(() => null)) as {
          success?: boolean;
          url?: string;
          error?: string;
        } | null;

        if (!response.ok || !payload?.success || !payload.url) {
          throw new Error(payload?.error ?? "Upload failed");
        }

        setImageUrl(payload.url);
        setErrors((prev) => ({ ...prev, image: undefined }));
        toast.success("Image uploaded successfully.");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[submit] image upload failed", error);
        }
        toast.error(
          error instanceof Error
            ? error.message
            : "We couldn’t upload that image right now. Please try a smaller file."
        );
        clearImage();
        setErrors((prev) => ({
          ...prev,
          image:
            error instanceof Error
              ? error.message
              : "We couldn’t upload that image right now. Please try a smaller file.",
        }));
      } finally {
        setIsUploadingImage(false);
      }
    },
    [clearImage, ensureAuthenticated, setErrors]
  );

  const handleSelectedFile = useCallback(
    async (file: File) => {
      if (isUploadingImage) {
        toast("Please wait for the current image upload to finish.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload a PNG, JPG, or WebP image.",
        }));
        toast.error("Please upload a valid image file.");
        return;
      }

      if (file.size > 1_048_576) {
        setErrors((prev) => ({
          ...prev,
          image: "Image is too large. Please upload a file under 1MB.",
        }));
        toast.error("Image is too large. Please upload a file under 1MB.");
        return;
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      const previewUrl = URL.createObjectURL(file);
      previewUrlRef.current = previewUrl;
      setImagePreview(previewUrl);
      setErrors((prev) => ({ ...prev, image: undefined }));

      await uploadImage(file);
    },
    [isUploadingImage, setErrors, uploadImage]
  );

  const handleInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await handleSelectedFile(file);
      }
      event.target.value = "";
    },
    [handleSelectedFile]
  );

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!ensureAuthenticated()) {
        return;
      }
      event.stopPropagation();
      setIsDraggingImage(false);

      const file = event.dataTransfer.files?.[0];
      if (file) {
        await handleSelectedFile(file);
      }
    },
    [ensureAuthenticated, handleSelectedFile]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingImage(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingImage(false);
  }, []);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAutofill = useCallback(async () => {
    if (!link.trim()) {
      toast.error("Add your product link before using AI Autofill.");
      return;
    }

    setShowAutofillConfirm(false);
    setIsAutofilling(true);

    try {
      const response = await fetch("/api/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link.trim() }),
      });

      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        data?: { name?: string; description?: string; introduction?: string };
        error?: string;
      } | null;

      if (!response.ok || !payload?.success || !payload.data) {
        throw new Error(
          payload?.error ??
            "AI Autofill couldn’t analyze that link. Please fill the form manually."
        );
      }

      const autofillData = payload.data;

      if (autofillData.name) {
        setName(autofillData.name);
      }
      if (autofillData.description) {
        setDescription(autofillData.description);
      }
      if (autofillData.introduction) {
        setIntroduction(autofillData.introduction);
      }

      setErrors((prev) => ({
        ...prev,
        link: undefined,
        name: autofillData.name ? undefined : prev.name,
        description: autofillData.description ? undefined : prev.description,
        introduction: autofillData.introduction ? undefined : prev.introduction,
      }));

      toast.success("We pre-filled the form using your product link.");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[submit] autofill failed", error);
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing that link. Please try again."
      );
    } finally {
      setIsAutofilling(false);
    }
  }, [link, setErrors]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!ensureAuthenticated()) {
        return;
      }

      if (isUploadingImage) {
        toast("Please wait for the image upload to finish.");
        setErrors((prev) => ({
          ...prev,
          image:
            "Please wait for the current image upload to finish before submitting.",
        }));
        return;
      }

      const trimmedLink = link.trim();
      const trimmedName = name.trim();
      const trimmedDescription = description.trim();
      const trimmedIntroduction = introduction.trim();
      const normalizedLinkValue = normalizeExternalUrl(trimmedLink);

      const nextErrors: SubmitErrors = {};

      if (!trimmedLink) {
        nextErrors.link = "Please add your product link.";
      } else if (!normalizedLinkValue) {
        nextErrors.link = "Enter a valid URL, for example https://example.com.";
      }

      if (!trimmedName) {
        nextErrors.name = "Give your product a name.";
      }

      if (selectedCategories.length === 0) {
        nextErrors.categories = "Pick at least one category.";
      }

      if (selectedTags.length === 0) {
        nextErrors.tags = "Choose a few tags to help discovery.";
      }

      if (!trimmedDescription) {
        nextErrors.description = "Add a short description.";
      }

      if (!trimmedIntroduction) {
        nextErrors.introduction =
          "Share a longer introduction for your product.";
      }

      if (!imageUrl) {
        nextErrors.image = "Upload a hero image before submitting.";
      }

      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        toast.error("Please fix the highlighted fields before submitting.");
        return;
      }

      const finalImageUrl = imageUrl as string;

      const payload = {
        link: normalizedLinkValue ?? trimmedLink,
        name: trimmedName,
        categories: selectedCategories,
        tags: selectedTags,
        description: trimmedDescription,
        introduction: trimmedIntroduction,
        imageUrl: finalImageUrl,
      };

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = (await response.json().catch(() => null)) as {
          success?: boolean;
          error?: string;
          site?: { id: number; slug: string; uuid: string };
        } | null;

        if (!response.ok || !result?.success || !result.site?.uuid) {
          throw new Error(
            result?.error ??
              "We couldn’t submit your product. Please try again."
          );
        }

        const targetUuid = result.site.uuid;

        toast.success("Thanks! We received your submission.");

        setLink("");
        setName("");
        setSelectedCategories([]);
        setSelectedTags([]);
        setDescription("");
        setIntroduction("");
        clearImage();
        setErrors({});

        router.push(`/payment/${targetUuid}`);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[submit] submission failed", error);
        }
        toast.error(
          error instanceof Error
            ? error.message
            : "We couldn’t submit your product. Please try again in a moment."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      clearImage,
      description,
      imageUrl,
      introduction,
      isUploadingImage,
      link,
      name,
      selectedCategories,
      selectedTags,
      router,
      setErrors,
      ensureAuthenticated,
    ]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fff7f5] to-white text-[#1f1f1f]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[92rem] flex-col px-6 pb-20 pt-14 lg:px-12 xl:px-20">
        <section className="space-y-12">
          <header className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[2.5rem] font-semibold tracking-tight text-[#17171c]">
                  Submit your product
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-[#6a6a74]">
                  Share your tool with the ToolCategory community. Provide clear
                  details so we can review, categorize, and feature your product
                  in the best collections.
                </p>
              </div>
            </div>
            <SumitSteps current="details" />
          </header>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-10 rounded-[10px] border border-[#e5e5ea] bg-white p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-[#1f1f24]">
                Link
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Enter the link to your product"
                    value={link}
                    onChange={(event) => {
                      setLink(event.target.value);
                      setErrors((prev) => ({ ...prev, link: undefined }));
                    }}
                    aria-invalid={Boolean(errors.link)}
                    className={cn(
                      "h-12 w-full rounded-[10px] border border-[#e0e0e6] bg-white px-4 text-sm text-[#2d2d32] placeholder:text-[#b0b0b5] transition focus:border-[#ff7d68] focus:outline-none focus:ring-2 focus:ring-[#ff7d68]/15",
                      errors.link && "border-[#ff9f8c] focus:ring-[#ff7d68]/25"
                    )}
                  />
                  <Button
                    type="button"
                    onClick={handleAutofillRequest}
                    disabled={isAutofillDisabled}
                    className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 items-center gap-2 rounded-[999px] bg-[#ff7d68] px-3 py-2 text-xs font-semibold text-white shadow-none transition hover:bg-[#ff6b54] disabled:cursor-not-allowed disabled:opacity-60 sm:flex"
                  >
                    {isAutofilling ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Filling...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-3.5 w-3.5" />
                        <span>AI Autofill</span>
                      </>
                    )}
                  </Button>
                </div>
                {errors.link ? (
                  <p className="text-xs text-[#ff7d68]">{errors.link}</p>
                ) : null}
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-[#1f1f24]">
                Name
                <input
                  type="text"
                  placeholder="Enter the name of your product"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  aria-invalid={Boolean(errors.name)}
                  className={cn(
                    "h-12 w-full rounded-[10px] border border-[#e0e0e6] bg-white px-4 text-sm text-[#2d2d32] placeholder:text-[#b0b0b5] transition focus:border-[#ff7d68] focus:outline-none focus:ring-2 focus:ring-[#ff7d68]/15",
                    errors.name && "border-[#ff9f8c] focus:ring-[#ff7d68]/25"
                  )}
                />
                {errors.name ? (
                  <p className="text-xs text-[#ff7d68]">{errors.name}</p>
                ) : null}
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <MultiSelect
                  label="Categories"
                  placeholder="Select categories"
                  options={categoryOptions}
                  value={selectedCategories}
                  onChange={(values) => {
                    setSelectedCategories(values);
                    setErrors((prev) => ({ ...prev, categories: undefined }));
                  }}
                  borderClassName={cn(
                    "border-[#e0e0e6] hover:border-[#ff7d68] focus:border-[#ff7d68]",
                    errors.categories && "border-[#ff9f8c]"
                  )}
                />
                {errors.categories ? (
                  <p className="text-xs text-[#ff7d68]">{errors.categories}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <MultiSelect
                  label="Tags"
                  placeholder="Select tags"
                  options={tagOptions}
                  value={selectedTags}
                  onChange={(values) => {
                    setSelectedTags(values);
                    setErrors((prev) => ({ ...prev, tags: undefined }));
                  }}
                  borderClassName={cn(
                    "border-[#e0e0e6] hover:border-[#ff7d68] focus:border-[#ff7d68]",
                    errors.tags && "border-[#ff9f8c]"
                  )}
                />
                {errors.tags ? (
                  <p className="text-xs text-[#ff7d68]">{errors.tags}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-[#1f1f24]">
                <span>Description</span>
                <span className="text-xs font-normal text-[#9a9aa3]">
                  [Words: 0/80-160]
                </span>
              </div>
              <textarea
                placeholder="Enter a brief description of your product... For example: A powerful AI content generation tool that helps creators produce high-quality articles and marketing copy with advanced NLP capabilities"
                rows={3}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }}
                aria-invalid={Boolean(errors.description)}
                className={cn(
                  "min-h-[110px] w-full rounded-[10px] border border-[#e0e0e6] bg-white px-4 py-3 text-sm leading-relaxed text-[#2d2d32] placeholder:text-[#b0b0b5] transition focus:border-[#ff7d68] focus:outline-none focus:ring-2 focus:ring-[#ff7d68]/15",
                  errors.description &&
                    "border-[#ff9f8c] focus:ring-[#ff7d68]/25"
                )}
              />
              {errors.description ? (
                <p className="text-xs text-[#ff7d68]">{errors.description}</p>
              ) : null}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-[#1f1f24]">
                <span>Introduction</span>
                <span className="text-xs font-normal text-[#9a9aa3]">
                  [Words: 0/1000-4000] (Markdown supported)
                </span>
              </div>
              <MarkdownEditor
                value={introduction}
                onChange={(value) => {
                  setIntroduction(value);
                  setErrors((prev) => ({ ...prev, introduction: undefined }));
                }}
                className={errors.introduction ? "border-[#ff9f8c]" : undefined}
                placeholder={
                  "Enter your content here... For Example:\n• Overview\n• Key Features\n• Use Cases\n• Getting Started\n• Pricing & Plans"
                }
              />
              {errors.introduction ? (
                <p className="text-xs text-[#ff7d68]">{errors.introduction}</p>
              ) : null}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-[#1f1f24]">
                <span>Image</span>
                <span className="text-xs font-normal text-[#9a9aa3]">
                  (16:9, PNG or JPEG, max 1MB)
                </span>
              </div>
              <div
                onClick={openFilePicker}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed bg-[#f8f8fb] text-sm text-[#858593] transition",
                  errors.image ? "border-[#ff9f8c]" : "border-[#d7d7dd]",
                  isDraggingImage
                    ? "border-[#ff7d68] bg-[#fff4ef]"
                    : "hover:bg-[#f0f0f3]"
                )}
              >
                {imagePreview ? (
                  <>
                    <NextImage
                      src={imagePreview}
                      alt="Uploaded preview"
                      fill
                      priority={false}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 720px"
                      className="pointer-events-none object-contain"
                    />
                    <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="pointer-events-none rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
                        {imageUrl ? "Image uploaded" : "Preparing upload"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            openFilePicker();
                          }}
                          className="border-white/60 bg-white/80 text-[#ff7d68] backdrop-blur transition hover:border-white hover:bg-white"
                        >
                          Replace
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            clearImage();
                          }}
                          className="bg-black/50 text-white hover:bg-black/70"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 px-6 text-center text-sm text-[#7a7a87]">
                    <ImageIcon aria-hidden className="h-7 w-7 text-[#c4c4cc]" />
                    <div className="space-y-1">
                      <p className="font-medium text-[#515156]">
                        Drag &amp; drop your hero image
                      </p>
                      <p className="text-xs text-[#9a9aa3]">
                        or click to browse files from your device
                      </p>
                    </div>
                  </div>
                )}

                {isUploadingImage ? (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/60">
                    <Loader2 className="h-8 w-8 animate-spin text-[#ff7d68]" />
                  </div>
                ) : null}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>
              {imageUrl ? (
                <p className="text-xs text-[#7a7a87]">
                  Uploaded to: {imageUrl}
                </p>
              ) : errors.image ? (
                <p className="text-xs text-[#ff7d68]">{errors.image}</p>
              ) : null}
              <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
            </div>

            <div className="rounded-[10px] border border-[#f2f2f4] bg-[#fafafb] px-6 py-5 text-xs text-[#7c7c86]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className={cn(
                    "flex items-center gap-2 rounded-[12px] bg-[#ff7d68] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff6b54]",
                    (isSubmitting || isUploadingImage) &&
                      "cursor-not-allowed opacity-70"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </Button>
                <p className="flex items-center gap-2 text-[#8a8a94]">
                  <span role="img" aria-label="smile">
                    🙂
                  </span>
                  No worries, you can change this information later.
                </p>
              </div>
            </div>
          </form>
        </section>
      </main>

      <SiteFooter />

      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff7d68] text-white shadow-[0_20px_40px_-18px_rgba(255,125,104,0.7)] transition hover:bg-[#ff6b54]"
      >
        <ArrowUp className="h-5 w-5" />
      </a>

      <Dialog open={showAutofillConfirm} onOpenChange={setShowAutofillConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Autofill</DialogTitle>
            <DialogDescription>
              Would you like AI to automatically fill in the form using this
              URL? It may take a moment, so please wait patiently while we
              analyze the page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAutofillConfirm(false)}
              className="w-full border-[#ffb8aa] text-[#ff7d68] transition hover:border-[#ff7d68] hover:bg-[#fff1ec] sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAutofill}
              disabled={isAutofilling}
              className="flex w-full items-center justify-center gap-2 bg-[#ff7d68] text-white transition hover:bg-[#ff6b54] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isAutofilling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Analyze & Autofill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
