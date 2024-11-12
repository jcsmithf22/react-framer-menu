import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { css } from "../../../styled-system/css";
import { center, hstack } from "../../../styled-system/patterns";
import { RemoveScroll } from "react-remove-scroll";
import FocusLock from "react-focus-lock";

type MenuContext = {
  isOpen: boolean;
  submenuState: {
    [key: string]: boolean;
  };
  closeMenu: () => void;
  openMenu: () => void;
  toggleSubmenuState: (id: string) => void;
};

const menuStateContext = React.createContext<MenuContext>({
  isOpen: false,
  closeMenu: () => {},
  openMenu: () => {},
  toggleSubmenuState: () => {},
  submenuState: {},
});

const MenuStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [submenuState, setSubmenuState] = React.useState<{
    [key: string]: boolean;
  }>(() => {
    const state: { [key: string]: boolean } = {};
    navigationItems.forEach((item) => {
      if (item.subitems) {
        state[item.id] = false;
      }
    });
    return state;
  });

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
    setSubmenuState(() => {
      const state: { [key: string]: boolean } = {};
      navigationItems.forEach((item) => {
        if (item.subitems) {
          state[item.id] = false;
        }
      });
      return state;
    });
  }, []);

  const openMenu = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const toggleSubmenuState = React.useCallback((id: string) => {
    setSubmenuState((state) => ({
      ...state,
      [id]: !state[id],
    }));
  }, []);

  const value = React.useMemo(
    () => ({ isOpen, submenuState, closeMenu, openMenu, toggleSubmenuState }),
    [isOpen, submenuState, closeMenu, openMenu, toggleSubmenuState]
  );
  return (
    <menuStateContext.Provider value={value}>
      {children}
    </menuStateContext.Provider>
  );
};

const menuContainerVariant = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100vw - 32px) 32px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(24px at calc(100vw - 32px) 32px)",
    transition: {
      delay: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

type NavigationItem = {
  title: string;
  url: string;
  id: string;
  subitems?: NavigationItem[];
};

const navigationItems: NavigationItem[] = [
  {
    title: "Home",
    url: "#",
    id: crypto.randomUUID(),
  },
  {
    title: "About",
    url: "#",
    id: crypto.randomUUID(),
    subitems: [
      {
        title: "About 1",
        url: "#",
        id: crypto.randomUUID(),
      },
      {
        title: "About 2",
        url: "#",
        id: crypto.randomUUID(),
      },
      {
        title: "About 3",
        url: "#",
        id: crypto.randomUUID(),
      },
    ],
  },
  {
    title: "Contact",
    url: "#",
    id: crypto.randomUUID(),
  },
];

function MobileMenu() {
  return (
    <MenuStateProvider>
      <MobileMenuChildren />
    </MenuStateProvider>
  );
}

function MobileMenuChildren() {
  const { isOpen, closeMenu, openMenu } = React.useContext(menuStateContext);
  // console.log("render");
  return (
    <RemoveScroll enabled={isOpen}>
      <FocusLock disabled={!isOpen}>
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={menuContainerVariant}
          className={css({
            bg: "black",
            position: "absolute",
            inset: "0",
          })}
        >
          <div
            className={css({
              position: "absolute",
              display: "flex",
              right: "3",
              top: "3",
              mt: "-0.5",
            })}
          >
            <MenuToggle
              className={center({
                h: "10",
                w: "10",
                borderRadius: "full",
                cursor: "pointer",
                mt: "0.5",
              })}
              toggle={() => (isOpen ? closeMenu() : openMenu())}
            />
          </div>
          <AnimatePresence>
            {isOpen && <MobileMenuItems key="menu-items" />}
          </AnimatePresence>
        </motion.div>
      </FocusLock>
    </RemoveScroll>
  );
}

type PathProps = React.ComponentProps<typeof motion.path>;

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="white"
    strokeLinecap="round"
    {...props}
  />
);

type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  toggle: () => void;
};

export const MenuToggle = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ toggle, ...delegated }, forwardedRef) => (
    <button ref={forwardedRef} onClick={toggle} {...delegated}>
      <svg
        width="23"
        height="23"
        viewBox="0 0 23 23"
        className={css({
          mt: "0.5",
          ml: "0.5",
        })}
      >
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
      <span
        className={css({
          srOnly: true,
        })}
      >
        Toggle Mobile Menu
      </span>
    </button>
  )
);

const menuListVariant = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const menuItemVariant = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const MobileMenuItems = () => {
  return (
    <motion.ul
      initial="closed"
      animate="open"
      exit="closed"
      variants={menuListVariant}
      className={css({
        listStyle: "none",
        p: "0",
        m: "0",
        mt: "40",
        px: "8",
      })}
    >
      {navigationItems.map((item) => (
        <MobileMenuItem
          key={item.id}
          title={item.title}
          url={item.url}
          id={item.id}
          subitems={item.subitems}
        />
      ))}
    </motion.ul>
  );
};

const MobileMenuItem = ({
  title,
  url,
  id,
  subitems,
}: {
  title: string;
  url: string;
  id: string;
  subitems?: NavigationItem[] | undefined;
}) => {
  const { submenuState, toggleSubmenuState } =
    React.useContext(menuStateContext);
  const isOpen = submenuState[id];

  return (
    <>
      <motion.li
        layout
        key={id}
        variants={menuItemVariant}
        className={css({
          display: "block",
          color: "white",
          fontSize: "2xl",
          // fontWeight: "bold",
          mb: "6",
        })}
      >
        {subitems ? (
          <motion.button
            className={hstack({
              color: "inherit",
              justify: "space-between",
              w: "full",
              cursor: "pointer",
            })}
            onClick={() => toggleSubmenuState(id)}
          >
            {title}
            <svg
              className={css({
                transform: isOpen ? "rotate(180deg)" : "",
                transition: "transform 0.2s ease",
              })}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              width={24}
              height={24}
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </motion.button>
        ) : (
          <a href={url}>{title}</a>
        )}
      </motion.li>
      <AnimatePresence mode="popLayout">
        {isOpen && subitems && (
          <SubmenuItems
            key={`${id}-subitems`}
            subitems={subitems}
            isOpen={isOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

type SubmenuItemsProps = {
  subitems: NavigationItem[];
  isOpen: boolean;
};

const SubmenuItems = React.forwardRef<HTMLUListElement, SubmenuItemsProps>(
  ({ subitems, isOpen }, forwardedRef) => {
    return (
      <motion.ul
        ref={forwardedRef}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        exit="closed"
        variants={menuListVariant}
        className={css({
          listStyle: "none",
          p: "0",
          px: "8",
        })}
      >
        {subitems.map((item) => (
          <motion.li
            key={item.id}
            variants={menuItemVariant}
            className={css({
              display: "block",
              color: "white",
              fontSize: "xl",
              // fontWeight: "bold",
              mb: "6",
            })}
          >
            <a href={item.url}>{item.title}</a>
          </motion.li>
        ))}
      </motion.ul>
    );
  }
);

export default MobileMenu;
