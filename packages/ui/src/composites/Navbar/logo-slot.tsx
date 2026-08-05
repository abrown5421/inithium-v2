import * as React from 'react';
import { Text } from '../../primitives/text.js';
import { NavbarLinkComponent, NavbarLogo } from './navbar.types.js';

const DefaultLink: NavbarLinkComponent = ({ href, className, children, onClick }) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);

export interface LogoSlotProps {
  readonly logo?: NavbarLogo;
  readonly title?: string;
  readonly homeHref?: string;
  readonly onLogoClick?: () => void;
  readonly linkComponent?: NavbarLinkComponent;
}

const renderLogoContent = (logo?: NavbarLogo, title?: string): React.ReactNode => (
  <>
    {logo ? <img src={logo.src} alt={logo.alt ?? title ?? ''} className="h-8 w-auto" /> : null}
    {title ? (
      <Text as="span" size="lg" weight="semibold" font="primary">
        {title}
      </Text>
    ) : null}
  </>
);

export const LogoSlot: React.FC<LogoSlotProps> = ({
  logo,
  title,
  homeHref = '/',
  onLogoClick,
  linkComponent: Link = DefaultLink
}) => {
  if (!logo && !title) {
    return null;
  }

  const content = renderLogoContent(logo, title);
  const className = 'flex items-center gap-2';

  return (
    <Link href={homeHref} className={className} onClick={onLogoClick}>
      {content}
    </Link>
  );
};