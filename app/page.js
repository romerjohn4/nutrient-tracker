import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <h1 className="font-bold text-center text-4xl p-10">Click below to access the nutrition checker!</h1>
      <p className="m-2 text-xl underline text-center">
      <Link href ="./Project-Nutrient-Tracker">Nutrition Checker</Link>
      </p>
    </main>
  );
}
