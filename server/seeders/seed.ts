import "dotenv/config";
import { hash } from "bcryptjs";
import { prisma } from "../utils/prisma";

const users = [
  {
    email: process.env.ADMIN_EMAIL ?? "admin@example.com",
    name: process.env.ADMIN_NAME ?? "Admin User",
    role: 0,
    password: process.env.ADMIN_PASSWORD ?? "admin123456",
  },
  {
    email: "maya@example.com",
    name: "Maya Hassan",
    role: 1,
    password: "user123456",
  },
  {
    email: "omar@example.com",
    name: "Omar Saleh",
    role: 1,
    password: "user123456",
  },
  {
    email: "lina@example.com",
    name: "Lina Ahmad",
    role: 1,
    password: "user123456",
  },
];

const categories = [
  { name: "Bug", description: "Unexpected product behavior" },
  { name: "Feature", description: "New product capabilities" },
  { name: "Improvement", description: "Enhancements to existing behavior" },
  { name: "Question", description: "Product questions and clarifications" },
];

const feedback = [
  {
    title: "Add keyboard shortcuts",
    description:
      "Power users need shortcuts for navigation and common feedback actions.",
    category: "Feature",
    status: 2,
    pinned: true,
    author: "maya@example.com",
  },
  {
    title: "Search loses filters after refresh",
    description:
      "Selected category and status filters should survive a page refresh.",
    category: "Bug",
    status: 1,
    pinned: false,
    author: "omar@example.com",
  },
  {
    title: "Improve mobile feedback form",
    description:
      "The feedback form needs better spacing and clearer validation on small screens.",
    category: "Improvement",
    status: 3,
    pinned: true,
    author: "lina@example.com",
  },
  {
    title: "Can completed requests be reopened?",
    description: "Document whether a completed request can return to review.",
    category: "Question",
    status: 0,
    pinned: false,
    author: "maya@example.com",
  },
  {
    title: "Add weekly digest emails",
    description:
      "Send a weekly summary of popular and recently completed requests.",
    category: "Feature",
    status: 0,
    pinned: false,
    author: "omar@example.com",
  },
  {
    title: "Show vote history",
    description:
      "Let users see the requests they voted for from their profile.",
    category: "Improvement",
    status: 4,
    pinned: false,
    author: "lina@example.com",
  },
];

const extraNames = [
  "Nour Khalil",
  "Yousef Darwish",
  "Salma Nasser",
  "Karim Mansour",
  "Rana Ibrahim",
  "Tariq Haddad",
  "Hala Saad",
  "Ziad Hamdan",
  "Dina Mahmoud",
  "Sami Farah",
  "Reem Abbas",
  "Fadi Karam",
];
for (const [index, name] of extraNames.entries()) {
  users.push({
    email: `user${index + 1}@example.com`,
    name,
    role: 1,
    password: "user123456",
  });
}

const requestTopics = [
  [
    "Add dark mode",
    "Offer a comfortable dark theme that follows the operating system preference.",
  ],
  [
    "Bulk feedback actions",
    "Allow selecting multiple requests for common organization actions.",
  ],
  [
    "Export requests to CSV",
    "Teams need a simple export for offline analysis and reporting.",
  ],
  [
    "Mention teammates in comments",
    "Support mentions so the right teammate can join a discussion quickly.",
  ],
  [
    "Improve notification controls",
    "Let users choose which request events trigger notifications.",
  ],
  [
    "Add roadmap view",
    "Display planned and in-progress requests on a clear product roadmap.",
  ],
  [
    "Duplicate request detection",
    "Suggest similar requests before a new request is submitted.",
  ],
  [
    "Saved filter presets",
    "Allow users to save frequently used filter combinations.",
  ],
  [
    "Faster image uploads",
    "Compress large images without visible quality loss.",
  ],
  [
    "Accessible keyboard focus",
    "Ensure every action is keyboard reachable with clear focus states.",
  ],
  [
    "Comment reactions",
    "Add lightweight reactions for acknowledging useful discussion.",
  ],
  ["Request activity timeline", "Show request events in chronological order."],
  [
    "Custom status labels",
    "Allow administrators to configure workflow labels.",
  ],
  [
    "Mobile navigation polish",
    "Make navigation faster and easier on small screens.",
  ],
  [
    "Archive completed requests",
    "Keep old completed work searchable but out of the default view.",
  ],
  [
    "Public sharing links",
    "Generate read-only links for external stakeholders.",
  ],
  [
    "Advanced search syntax",
    "Support exact phrases and field-specific search.",
  ],
  [
    "Vote threshold automation",
    "Notify owners when requests reach vote thresholds.",
  ],
  ["Category color labels", "Give categories distinct accessible colors."],
  [
    "Draft feedback requests",
    "Let users save incomplete requests before submitting.",
  ],
  [
    "Pin important comments",
    "Allow owners to highlight useful discussion responses.",
  ],
  [
    "Localized date formatting",
    "Format dates according to the interface language.",
  ],
  [
    "Merge duplicate requests",
    "Combine duplicates without losing votes or comments.",
  ],
  [
    "Weekly product report",
    "Summarize request volume, status changes, and engagement.",
  ],
];
for (const [index, topic] of requestTopics.entries()) {
  feedback.push({
    title: topic[0],
    description: topic[1],
    category: categories[index % categories.length].name,
    status: index % 6,
    pinned: index % 9 === 0,
    author: users[(index % (users.length - 1)) + 1].email,
  });
}

async function run(): Promise<void> {
  const accounts = new Map<string, { id: string }>();
  for (const item of users) {
    const password = await hash(item.password, 10);
    const account = await prisma.account.upsert({
      where: { email: item.email },
      update: { name: item.name, role: item.role, isEmailVerified: true },
      create: {
        email: item.email,
        name: item.name,
        role: item.role,
        password,
        isEmailVerified: true,
        slug: item.email.split("@")[0],
      },
      select: { id: true },
    });
    accounts.set(item.email, account);
  }

  const categoryIds = new Map<string, string>();
  for (const item of categories) {
    const category = await prisma.category.upsert({
      where: { name: item.name },
      update: { ...item, isActive: true },
      create: item,
    });
    categoryIds.set(item.name, category.id);
  }

  const requests: Array<{ id: string }> = [];
  for (const item of feedback) {
    const authorId = accounts.get(item.author)!.id;
    const categoryId = categoryIds.get(item.category)!;
    const existing = await prisma.feedbackRequest.findFirst({
      where: { title: item.title, authorId },
    });
    const request = existing
      ? await prisma.feedbackRequest.update({
          where: { id: existing.id },
          data: {
            description: item.description,
            categoryId,
            status: item.status,
            pinned: item.pinned,
          },
        })
      : await prisma.feedbackRequest.create({
          data: {
            title: item.title,
            description: item.description,
            categoryId,
            authorId,
            status: item.status,
            pinned: item.pinned,
          },
        });
    requests.push(request);
  }

  const voters = [...accounts.values()].slice(1);
  for (
    let requestIndex = 0;
    requestIndex < requests.length;
    requestIndex += 1
  ) {
    for (
      let voterIndex = 0;
      voterIndex < Math.min(voters.length, (requestIndex % 3) + 1);
      voterIndex += 1
    ) {
      const where = {
        feedbackRequestId: requests[requestIndex].id,
        authorId: voters[voterIndex].id,
      };
      if (!(await prisma.vote.findFirst({ where })))
        await prisma.vote.create({ data: where });
    }
    const authorId = voters[requestIndex % voters.length].id;
    const content = `Seed discussion for “${feedback[requestIndex].title}”.`;
    const where = {
      feedbackRequestId: requests[requestIndex].id,
      authorId,
      content,
    };
    if (!(await prisma.comment.findFirst({ where })))
      await prisma.comment.create({ data: where });
  }

  const settings = await prisma.appSettings.findFirst();
  if (settings) await prisma.appSettings.update({ where: { id: settings.id }, data: { appVersion: "1.0.0", maintenanceMode: false } });
  else await prisma.appSettings.create({ data: { appVersion: "1.0.0", maintenanceMode: false } });
  console.log(
    `Seed complete: ${users.length} users, ${categories.length} categories, ${feedback.length} feedback requests, plus comments and votes.`,
  );
}

run()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
