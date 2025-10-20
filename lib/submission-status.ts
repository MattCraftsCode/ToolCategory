type SubmissionStatusInput = {
  isPublished: boolean;
  isVerified: boolean;
  userType: string | null | undefined;
};

type SubmissionStatus = {
  label: "Published" | "In Review" | "Badge Verification Required";
  color?: string;
};

const SUCCESS_COLOR = "#32b872";
const ERROR_COLOR = "#ff6d57";

export function getSubmissionStatus({
  isPublished,
  isVerified,
  userType,
}: SubmissionStatusInput): SubmissionStatus {
  if (isPublished) {
    return { label: "Published", color: SUCCESS_COLOR };
  }

  const normalizedType = typeof userType === "string" ? userType.toLowerCase() : "";
  const isPaidUser = normalizedType === "basic" || normalizedType === "pro";

  if (isPaidUser || isVerified) {
    return { label: "In Review" };
  }

  return { label: "Badge Verification Required", color: ERROR_COLOR };
}
