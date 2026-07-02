import {
  CheckCircleIcon,
  EyeOffIcon,
  LockIcon,
  ShieldIcon,
} from '../icons/Icons';

const securityItems = [
  {
    title: '256-bit SSL encryption',
    text: 'Every connection is fully encrypted end-to-end.',
    Icon: LockIcon,
  },
  {
    title: 'PCI-DSS compliant',
    text: 'Card payments meet the highest security standards.',
    Icon: CheckCircleIcon,
  },
  {
    title: 'We never store card details',
    text: 'Payment data is handled only by trusted processors.',
    Icon: EyeOffIcon,
  },
  {
    title: 'M-Pesa secured by Safaricom',
    text: 'Authorize each payment with your own PIN.',
    Icon: ShieldIcon,
  },
];

export function SecurityFooter() {
  return (
    <section className="security-footer">
      <div className="security-footer-heading">
        <span className="security-icon" aria-hidden="true">
          <ShieldIcon />
        </span>
        <div>
          <h2>Your information is safe with us</h2>
          <p>
            We take the security of your personal and payment details seriously.
          </p>
        </div>
      </div>
      <div className="security-grid">
        {securityItems.map(({ title, text, Icon }) => (
          <article key={title} className="security-item">
            <span className="security-item-icon" aria-hidden="true">
              <Icon />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
