import { LuInfo as HintIcon } from 'react-icons/lu';

const tips = [
  {
    title: 'Doğal Işığı Kullanın',
    description: 'En iyi sonuçlar için gün ışığından faydalanın.',
  },
  {
    title: 'Kompozisyona Dikkat Edin',
    description: 'Üçler kuralı gibi temel kompozisyon tekniklerini deneyin.',
  },
  {
    title: 'Netliği Kontrol Edin',
    description: 'Yüklemeden önce fotoğrafınızın net ve odaklanmış olduğundan emin olun.',
  },
  {
    title: 'Etiket Eklemeyi Unutmayın',
    description: 'Doğru etiketler fotoğrafınızın daha fazla kişiye ulaşmasını sağlar.',
  },
];

const UploadTips = () => {
  return (
    <aside className="hidden w-full flex-col gap-6 lg:flex">
      <h3 className="text-xl font-bold text-[#1b140e]">Fotoğraf Yükleme İpuçları</h3>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="rounded-lg border border-[#d3deda] bg-white/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-[#1b140e]">{tip.title}</h4>
              <HintIcon className="text-[#1b140e] text-lg shrink-0" />
            </div>
            <p className="mt-1 text-sm text-gray-600">{tip.description}</p>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default UploadTips;
