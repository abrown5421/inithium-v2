import * as React from 'react';
import { Button } from '../../primitives/button.js';
import type { CoreColorToken } from '../../theme/color-tokens.js';
import { Separator } from '../../primitives/separator.js';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../primitives/sheet.js';
import { NavbarLinkComponent, NavbarMenuItem } from './navbar.types.js';
import { NavLink } from './nav-link.js';

export interface NavDrawerSection {
  readonly items: readonly NavbarMenuItem[];
}

export interface NavDrawerFooterAction {
  readonly label: string;
  readonly onClick?: () => void;
  readonly color?: CoreColorToken;
}

export interface NavDrawerProps {
  readonly trigger: React.ReactNode;
  readonly triggerLabel: string;
  readonly sections: readonly NavDrawerSection[];
  readonly footerAction?: NavDrawerFooterAction;
  readonly linkComponent?: NavbarLinkComponent;
  readonly userName?: string;
}

const getGreeting = (userName?: string): string => {
  const hour = new Date().getHours();
  const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  return userName ? `Good ${period}, ${userName}` : `Good ${period}`;
};

export const NavDrawer: React.FC<NavDrawerProps> = ({
  trigger,
  triggerLabel,
  sections,
  footerAction,
  linkComponent,
  userName
}) => {
  const [open, setOpen] = React.useState(false);
  const closeDrawer = React.useCallback(() => setOpen(false), []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={triggerLabel}>
          {trigger}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-lg">{getGreeting(userName)}</SheetTitle>
        </SheetHeader>
        <nav aria-label={triggerLabel} className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {sections.map((section, index) => (
            <React.Fragment key={index}>
              {index > 0 ? <Separator /> : null}
              <div className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <NavLink key={item.label} item={item} linkComponent={linkComponent} fullWidth onNavigate={closeDrawer} />
                ))}
              </div>
            </React.Fragment>
          ))}
        </nav>
        {footerAction ? (
          <SheetFooter>
            <SheetClose asChild>
              <Button className="w-full" color={footerAction.color} onClick={footerAction.onClick}>
                {footerAction.label}
              </Button>
            </SheetClose>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
