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

// Security assurances shown below the donation form.
export function SecurityFooter() {
  return (
    <section className="px-5 sm:px-8 pb-8 pt-6 border-t border-gray-200 bg-gray-50">
      <div className="flex gap-3 mb-5 items-start">
        <span className="inline-flex shrink-0 text-green-600 [&_svg]:w-[1.375rem] [&_svg]:h-[1.375rem]" aria-hidden="true">
          <ShieldIcon />
        </span>
        <div>
          <h2 className="m-0 mb-1 text-[0.9375rem] font-bold text-gray-900">Your information is safe with us</h2>
          <p className="m-0 text-[0.8125rem] text-gray-500 leading-normal">
            We take the security of your personal and payment details seriously.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {securityItems.map(({ title, text, Icon }) => (
          <article key={title} className="flex gap-2.5 items-start p-3.5 bg-white border border-gray-200 rounded-lg">
            <span className="inline-flex shrink-0 text-green-600 [&_svg]:w-4 [&_svg]:h-4" aria-hidden="true">
              <Icon />
            </span>
            <div>
              <h3 className="m-0 mb-0.5 text-xs font-bold text-gray-800">{title}</h3>
              <p className="m-0 text-[0.6875rem] text-gray-500 leading-snug">{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
