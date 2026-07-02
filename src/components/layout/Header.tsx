import { HeartIcon } from '../icons/Icons';

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
