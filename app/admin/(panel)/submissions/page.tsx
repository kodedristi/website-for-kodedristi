import { listSubmissions, markSubmissionsRead } from "@/lib/db/queries";
import { SubmissionsPanel } from "@/components/admin/submissions-panel";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const submissions = await listSubmissions();

  const sectionCounts = submissions.reduce<Record<string, number>>((acc, s) => {
    acc[s.section] = (acc[s.section] ?? 0) + 1;
    return acc;
  }, {});
  const unreadCount = submissions.filter((s) => !s.read_at).length;

  // Opening the page is what counts as reading the list. Done after the rows
  // are already in hand, so this render still shows which ones were new.
  if (unreadCount > 0) {
    try {
      await markSubmissionsRead();
    } catch {
      // A failed write just means the badge clears on the next visit instead.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Submissions</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enquiries, proposals, course applications and partnership requests sent through the site.
        </p>
      </div>
      <SubmissionsPanel
        submissions={submissions.map((s) => ({
          id: s.id,
          section: s.section,
          data: s.data,
          created_at: s.created_at.toLocaleString(),
          unread: !s.read_at,
        }))}
        sectionCounts={sectionCounts}
        newCount={unreadCount}
      />
    </div>
  );
}
