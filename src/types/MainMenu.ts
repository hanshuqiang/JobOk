/** 菜单结构 */
interface MenuItem {
  id: string;
  label: string;
  children?: MenuItem[];
}

export type { MenuItem };
