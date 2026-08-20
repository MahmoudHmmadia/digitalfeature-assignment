export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
  baseText: string,
  checkExists: (slug: string) => Promise<boolean>,
  maxAttempts: number = 10,
): Promise<string> {
  let slug = generateSlug(baseText);
  let attempt = 0;

  while (await checkExists(slug)) {
    attempt++;
    if (attempt >= maxAttempts) {
      const timestamp = Date.now().toString(36);
      slug = `${generateSlug(baseText)}-${timestamp}`;
      break;
    }

    slug = `${generateSlug(baseText)}-${attempt + 1}`;
  }

  return slug;
}

export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function extractIdentifier(param: string): {
  type: "id" | "slug";
  value: string;
} {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (objectIdRegex.test(param)) {
    return { type: "id", value: param };
  }

  return { type: "slug", value: param };
}
