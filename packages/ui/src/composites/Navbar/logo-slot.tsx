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

export const LogoSlot: React.FC<LogoSlotProps> = ({ logo, title, homeHref, onLogoClick, linkComponent }) => {
  if (!logo && !title) {
    return null;
  }

  const content = (
    <>
      {logo ? <img src={logo.src} alt={logo.alt ?? title ?? ''} className="h-8 w-auto" /> : null}
      {title ? (
        <Text as="span" size="lg" weight="semibold">
          {title}
        </Text>
      ) : null}
    </>
  );

  const wrapperClassName = 'flex items-center gap-2';

  if (homeHref) {
    const Link = linkComponent ?? DefaultLink;
    return (
      <Link href={homeHref} className={wrapperClassName} onClick={onLogoClick}>
        {content}
      </Link>
    );
  }

  if (onLogoClick) {
    return (
      <button type="button" onClick={onLogoClick} className={wrapperClassName}>
        {content}
      </button>
    );
  }

  return <div className={wrapperClassName}>{content}</div>;
};
