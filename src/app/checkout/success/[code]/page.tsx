export default async function SuccessPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <h1 className="mb-6 text-4xl font-bold text-green-600">Order Received</h1>

      <p className="mb-8 text-xl">
        Present this code to our personnel to confirm your order and complete
        payment.
      </p>

      <div className="rounded-lg bg-gray-100 p-8">
        <p className="mb-2 text-sm tracking-widest text-gray-500 uppercase">
          Verification Code
        </p>
        <p className="font-mono text-6xl font-bold tracking-widest">
          {resolvedParams.code}
        </p>
      </div>
    </div>
  );
}
