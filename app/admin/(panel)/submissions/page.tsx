import { listSubmissions, markSubmissionsRead } from "@/lib/db/queries";
import { SubmissionsPanel } from "@/components/admin/submissions-panel";
import { toSubmissionView } from "@/lib/submissions-view";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const rows = await listSubmissions();
  const now = new Date();
  const submissions = rows.map((row) => toSubmissionView(row, now));
  const unreadCount = submissions.filter((s) => s.unread).length;

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
          Every enquiry includes the sender&apos;s email and phone number.
        </p>
      </div>
      <SubmissionsPanel submissions={submissions} newCount={unreadCount} />
    </div>
  );
}
