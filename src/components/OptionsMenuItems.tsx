import { Menu } from "@headlessui/react";

const OptionsMenuItems: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Menu.Items
      as="ul"
      className="menu rounded-box absolute right-0 z-20 mt-1 w-56 origin-top-right bg-base-300 p-2 shadow-md focus-visible:outline-none"
    >
      {children}
    </Menu.Items>
  );
};

export default OptionsMenuItems;
