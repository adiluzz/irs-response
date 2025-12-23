export type NavItemStatus = 'active' | 'available' | 'coming-soon' | 'disabled';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  status: NavItemStatus;
}

export interface NavCategory {
  id: string;
  title: string;
  items: NavItem[];
}

export const navigation: NavCategory[] = [
  {
    id: 'balance-due',
    title: 'Balance Due Notices',
    items: [
      { id: 'cp14', label: 'CP14', href: '/notice', status: 'available' },
      { id: 'cp501', label: 'CP501', status: 'coming-soon' },
      { id: 'cp503', label: 'CP503', status: 'coming-soon' },
      { id: 'cp504', label: 'CP504', status: 'coming-soon' },
    ],
  },
  {
    id: 'underreporter',
    title: 'Underreporter / Examination',
    items: [
      { id: 'cp2000', label: 'CP2000', status: 'coming-soon' },
      { id: 'cp2501', label: 'CP2501', status: 'coming-soon' },
      { id: 'letter-525', label: 'Letter 525', status: 'coming-soon' },
    ],
  },
  {
    id: 'collection',
    title: 'Collection & Enforcement',
    items: [
      { id: 'cp90', label: 'CP90 / CP91', status: 'coming-soon' },
      { id: 'lt11', label: 'LT11', status: 'coming-soon' },
      { id: 'letter-1058', label: 'Letter 1058', status: 'coming-soon' },
      { id: 'levy-notice', label: 'Levy Notices', status: 'coming-soon' },
      { id: 'tax-lien', label: 'Notice of Federal Tax Lien', status: 'coming-soon' },
    ],
  },
  {
    id: 'penalties',
    title: 'Penalties & Interest',
    items: [
      { id: 'cp161', label: 'CP161', status: 'coming-soon' },
      { id: 'cp215', label: 'CP215', status: 'coming-soon' },
    ],
  },
  {
    id: 'appeals',
    title: 'Appeals & Relief',
    items: [
      { id: 'form-843', label: 'Form 843', status: 'disabled' },
      { id: 'form-12153', label: 'Form 12153 (CDP)', status: 'coming-soon' },
      { id: 'offer-compromise', label: 'Offer in Compromise', status: 'coming-soon' },
    ],
  },
];