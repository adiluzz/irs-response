export enum NoticeType {
  CP2000 = 'cp2000',
  CP14 = 'cp14',
  CP501 = 'cp501',
  CP503 = 'cp503',
  CP504 = 'cp504',
}

export interface NoticeDefinition {
  type: NoticeType;
  code: string;
  title: string;
  description: string;
  route: string;
  enabled: boolean;
}

export const notices: NoticeDefinition[] = [
  {
    type: NoticeType.CP2000,
    code: 'CP2000',
    title: 'CP2000 Notice',
    description: 'Proposed changes to your tax return',
    route: '/notice/cp2000',
    enabled: true,
  },
  {
    type: NoticeType.CP14,
    code: 'CP14',
    title: 'CP14 Notice',
    description: 'Balance due on your tax account',
    route: '/notice/cp14',
    enabled: true,
  },
  {
    type: NoticeType.CP501,
    code: 'CP501',
    title: 'CP501 Notice',
    description: 'First reminder of balance due',
    route: '/notice/cp501',
    enabled: true,
  },
  {
    type: NoticeType.CP503,
    code: 'CP503',
    title: 'CP503 Notice',
    description: 'Second reminder of balance due',
    route: '/notice/cp503',
    enabled: true,
  },
  {
    type: NoticeType.CP504,
    code: 'CP504',
    title: 'CP504 Notice',
    description: 'Intent to levy',
    route: '/notice/cp504',
    enabled: true,
  },
];

export function getNoticeByType(type: NoticeType): NoticeDefinition | undefined {
  return notices.find((n) => n.type === type);
}

export function getNoticeByCode(code: string): NoticeDefinition | undefined {
  return notices.find((n) => n.code.toLowerCase() === code.toLowerCase());
}