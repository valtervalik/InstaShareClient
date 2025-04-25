'use client';

import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React, {
  Children,
  ReactElement,
  cloneElement,
  isValidElement,
  useMemo,
} from 'react';

interface NavLinkProps extends Omit<LinkProps, 'className'> {
  /**
   * A single React element (e.g. an `<a>` or `<button>`)
   */
  children: ReactElement;
  /**
   * Tailwind or custom classes to apply
   */
  className?: string;
  /**
   * CSS class to apply when the link is active
   * @default 'active'
   */
  activeClassName?: string;
  /**
   * If true, matches exactly the pathname; otherwise does startsWith
   * @default false
   */
  exact?: boolean;
}

function normalizePath(href?: LinkProps['href']): string {
  if (!href) return '';
  let path: string;
  if (typeof href === 'string') path = href;
  else if (typeof href === 'object' && 'pathname' in href)
    path = (href as { pathname: string }).pathname;
  else path = String(href);
  return decodeURIComponent(path);
}

export const NavLink: React.FC<NavLinkProps> = ({
  children,
  className: navClassName,
  activeClassName = 'active',
  exact = false,
  ...linkProps
}) => {
  const rawPath = usePathname() ?? '';
  const pathname = decodeURIComponent(rawPath);
  const hrefString = normalizePath(linkProps.href);
  const asString = normalizePath(linkProps.as);
  const isActive = useMemo(() => {
    if (exact) {
      return pathname === hrefString || pathname === asString;
    }
    return (
      (hrefString && pathname.startsWith(hrefString)) ||
      (asString && pathname.startsWith(asString))
    );
  }, [pathname, hrefString, asString, exact]);

  const rawChild = Children.only(children);
  if (!isValidElement(rawChild)) {
    console.warn('NavLink requires a single React element as its child.');
    return null;
  }
  const child = rawChild as ReactElement<any>;

  const mergedClassName = clsx(navClassName, child.props.className, {
    [activeClassName]: isActive,
  });

  return (
    <Link {...linkProps}>
      {cloneElement(child, {
        className: mergedClassName || undefined,
        'aria-current': isActive ? 'page' : undefined,
      })}
    </Link>
  );
};
