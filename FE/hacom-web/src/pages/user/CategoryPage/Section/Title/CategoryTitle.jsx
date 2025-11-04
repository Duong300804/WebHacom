export default function CategoryTitle({ categoryName, productCount }) {
  return (
    <div className="">
      <div className="inline-block relative">
        <div className="flex items-baseline space-x-2">
          <h2 className="text-3xl font-bold text-blue-800 uppercase">{categoryName}</h2>
          <span className="text-sm font-semibold text-neutral-500">({`Tổng ${productCount} sản phẩm`})</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-800"></div>
      </div>
    </div>
  );
}