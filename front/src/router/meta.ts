interface Menu {
  i18n?: string;
  parent?: any;
  relative?: string | symbol;
}

interface AuthView {
  type: string;
  relation?: number[] | string[];
}

interface Auth {
  superView?: any;
  view?: AuthView | (() => AuthView);
  operation?: any;
  permission?: any;
}

interface Layout {
  breadcrumb?: {
    show?: boolean;
    back?: boolean;
  };
}

interface Extra {
  [key: string]: any;
}

export interface RouteMetaConfig {
  available?: boolean;
  owner?: symbol | string;
  authKey?: string;
  view?: string;
  extra?: Extra;
  menu?: Menu;
  auth?: Auth;
  layout?: Layout;
  notMenu?: boolean;
  activeKey?: symbol | string;
  icon?: string;
}

export default class Meta {
  available = true;

  owner = '';

  authKey = 'view';

  view = 'default';

  extra: Extra = {};

  menu: Menu = {};

  auth: Auth = {};

  layout: Layout = {};

  constructor(data: RouteMetaConfig) {
    Object.keys(data).forEach((key) => {
      const typedKey = key as keyof RouteMetaConfig;
      Reflect.set(this, typedKey, data[typedKey]);
    });

    this.menu = Object.assign(this.menu, data.menu);

    this.auth = Object.assign(this.auth, data.auth);

    this.layout = Object.assign(this.layout, data.layout);

    this.extra = Object.assign(this.extra, data.extra);
  }
}
