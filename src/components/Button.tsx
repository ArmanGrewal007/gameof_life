export function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="transition ease-in flex items-center justify-center h-8 px-4 rounded-sm shadow-md bg-gray-500 hover:bg-gray-700 text-white"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
