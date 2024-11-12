import { css } from "../styled-system/css";
import { hstack } from "../styled-system/patterns";
import MobileMenu from "./components/MobileMenu/MobileMenu";
function App() {
  return (
    <>
      <header>
        <nav
          className={hstack({
            bg: "black",
            color: "white",
            gap: "2",
            p: "5",
          })}
        >
          <span
            className={css({
              position: "relative",
              zIndex: "10",
            })}
          >
            Navigation
          </span>
          <MobileMenu />
        </nav>
      </header>
      <main
        className={css({
          h: "screen",
        })}
      >
        Main content
      </main>
      <footer
        className={css({
          bg: "zinc.200",
        })}
      >
        Footer content
      </footer>
    </>
  );
}

export default App;
