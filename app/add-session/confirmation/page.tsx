export default async function Confirmation() {
  return (
    <div className="p-8 max-w-lg mx-auto flex flex-col">
      <h1 className="text-2xl font-bold">Session added</h1>
      <p className="text-white mt-4">
        Your session has been added successfully! You and any other hosts will
        receive an email confirming the details you specified.
      </p>
      <a
        className="bg-orange-500 mt-8 text-white font-semibold py-2 px-4 rounded shadow hover:bg-orange-600 mx-auto"
        href="/"
      >
        Back to schedule
      </a>
    </div>
  );
}
