import { angularNavManifest, type AngularNavPageId } from '../model/nav-manifest';

/** Map shell pathname → Angular page id under an embedded basename. */
export function pageIdFromPathname(pathname: string, baseHref: string): AngularNavPageId {
  const base = baseHref === '/' ? '' : baseHref.replace(/\/$/, '');
  const fallback = angularNavManifest.pages[0]?.id ?? 'overview';
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (base && !normalized.startsWith(base)) {
    // Outside this remote's namespace (e.g. mid-navigation away) — keep default.
    return fallback;
  }

  let rest = base ? normalized.slice(base.length) : normalized;

  if (rest.startsWith('/')) {
    rest = rest.slice(1);
  }

  const page = angularNavManifest.pages.find(entry => entry.segment === rest);

  return page?.id ?? fallback;
}
