/** Newsletter block on the homepage (Zoho list signup). */
export const SUBSCRIBE_SECTION_ID = "subscribe";

export const ZOHO_CIRCLE_OPTIN_ACTION = "https://zcv2-zcmp.maillist-manage.eu/weboptin.zc";

/** Hidden fields from the Zoho embed (list + form ids). */
export const ZOHO_CIRCLE_OPTIN_HIDDEN = {
  submitType: "optinCustomView",
  formType: "QuickForm",
  zx: "14aef2347c",
  zcvers: "2.0",
  mode: "OptinCreateView",
  zcld: "139a5f8fdbd00a32",
  zctd: "",
  zc_trackCode: "ZCFORMVIEW",
  zc_formIx: "3z2da86f78c8c76991c23c035e523df7ca40ce15eff9c3d7c9ec4bc63338bfe0df",
} as const;
