import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-semibold mb-4">Welcome to Your Task Manager</h1>
      <p className="mb-6">
        Please <Link href="/tasks" className="text-blue-600 underline">
          click here
        </Link>{" "}
to manage your tasks.
      </p>
    </div>
  );
}
