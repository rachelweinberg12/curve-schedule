export type NavItem = {
  name: string;
  href: string;
  icon: any;
};

export const CONSTS = {
  TITLE: "The Curve",
  DESCRIPTION:
    "Transformative AI discourse in >280 characters | November 22-24, Lighthaven",
  MULTIPLE_EVENTS: true,
  // If you have multiple events, add your events to the nav bar below
  // If you only have one event, you can leave the array empty
  // Find available icons at https://heroicons.com/
  NAV_ITEMS: [] as NavItem[],
};
