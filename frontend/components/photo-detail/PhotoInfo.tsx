type IPhotoInfo = {
  title: string;
  description: string;
  tags?: string[];
};

export default function PhotoInfo({ title, description, tags }: IPhotoInfo) {
  return (
    <>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-500 whitespace-pre-wrap">{description}</p> 
      <div className="hidden mt-4 md:flex flex-wrap gap-2 ">
        {tags?.map((tag, i) => (
          <span key={i} className="rounded bg-gray-100 px-3 py-1 text-sm font-bold">
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}