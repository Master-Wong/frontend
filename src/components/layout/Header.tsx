import { HeartIcon } from '../icons/Icons';

// Top page header with brand and tagline.
export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            <HeartIcon />
          </span>
          <span className="brand-name">Donations Portal</span>
        </div>
        <p className="header-tagline">Every contribution makes a difference</p>
      </div>
    </header>
  );
}
