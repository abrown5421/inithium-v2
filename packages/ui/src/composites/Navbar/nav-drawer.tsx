import * as React from 'react';
import { Button } from '../../primitives/button.js';
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
}

export interface NavDrawerProps {
  readonly trigger: React.ReactNode;
  readonly triggerLabel: string;
  readonly sections: readonly NavDrawerSection[];
  readonly footerAction?: NavDrawerFooterAction;
  readonly linkComponent?: NavbarLinkComponent;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({
  trigger,
  triggerLabel,
  sections,
  footerAction,
  linkComponent
}) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" aria-label={triggerLabel}>
        {trigger}
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="sr-only">{triggerLabel}</SheetTitle>
      </SheetHeader>
      <nav aria-label={triggerLabel} className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {index > 0 ? <Separator /> : null}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <SheetClose asChild key={item.label}>
                  <span>
                    <NavLink item={item} linkComponent={linkComponent} fullWidth />
                  </span>
                </SheetClose>
              ))}
            </div>
          </React.Fragment>
        ))}
      </nav>
      {footerAction ? (
        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full" onClick={footerAction.onClick}>
              {footerAction.label}
            </Button>
          </SheetClose>
        </SheetFooter>
      ) : null}
    </SheetContent>
  </Sheet>
);
