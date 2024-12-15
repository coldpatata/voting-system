import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface MenuItemProps {
  label: string;
  href?: string;
}

interface DropdownMenuProps {
  options: MenuItemProps[][];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Roles
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {options.map((group, index) => (
          <div className="py-1" key={index}>
            {group.map((item, subIndex) => (
              <MenuItem key={subIndex}>
                {({ active }) => (
                  <a
                    href={item.href || '#'}
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? 'bg-gray-100 text-gray-900 outline-none' : ''
                    }`}
                  >
                    {item.label}
                  </a>
                )}
              </MenuItem>
            ))}
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default DropdownMenu;
