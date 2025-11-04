export default function ProductDetailTitle({ productName }) {
  return (
    <div className="w-full">
      <div className="relative">
        <h2 className="text-xl font-bold text-black truncate max-w-full py-2">{productName}</h2>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-300"></div>
      </div>
    </div>
  );
}