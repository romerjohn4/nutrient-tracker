import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <h1 className="font-bold">CPRG 306: Web Development 2 - Project</h1>
      <p className="m-2 text-xxl">
      <Link href ="./Project-Nutrient-Tracker">Nutrition Checker</Link>
      </p>
    </main>
  );
}
