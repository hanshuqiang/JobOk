/**
 * steam账号结构
 */
interface SteamInfo {
  shared_secret: string;
  identity_secret: string;
  steam_username: string;
  steam_password: string;
  steam_cookie:string;
}

interface MobileInfo {
  mobileNumber: string;
  剩余话费: string;
  剩余流量: string;
  超出语音: string;
  可用积分: string;
}
/**
 * buff账号结构
 */
interface BuffAccount {
  buff_nick:string,
  buff_mobile:MobileInfo,
  buff_session: string;
  bind_steam_info: SteamInfo;
}

 
/**
 * 各类账号结构
 */
export type {  BuffAccount, SteamInfo, MobileInfo };
