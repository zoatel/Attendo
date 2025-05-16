export default function BG() {
  return (
    <div className="absolute top-0 left-0 w-full h-full  bg-gray-100 -z-10 opacity-75">
      <img
        src="/bg.jpg"
        alt="Background"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
