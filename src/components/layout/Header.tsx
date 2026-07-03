import { HeartIcon } from '../icons/Icons';

// Top page header with brand and tagline.
export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1060px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 bg-green-500 text-white rounded-md [&_svg]:w-[1.125rem] [&_svg]:h-[1.125rem]" aria-hidden="true">
            <HeartIcon />
          </span>
          <span className="font-bold text-[1.0625rem] text-gray-900">Donations Portal</span>
        </div>
        <p className="text-[0.8125rem] text-gray-400 m-0">Every contribution makes a difference</p>
      </div>
    </header>
  );
}
