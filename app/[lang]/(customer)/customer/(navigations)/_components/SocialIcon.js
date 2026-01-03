import Link from "next/link";

const SocialIcon = ({ Icon, href, color }) => (
  <Link
    href={href}
    className={`hover:text-primary bg-slate-100 p-3 transition-colors duration-200 transform translate-y-8 group-hover:translate-y-0 ${color}`}
  >
    <Icon size={24} />
  </Link>
);

export default SocialIcon;
