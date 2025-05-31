import { useState } from "react";
import DropdownMenu from "./dropdown1";

export default function Navbar() {

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  return (
    <nav className="nav">
     <ul>
      <li>
          <a href="/">Home</a>
      </li>
      <li>
      <div
          className="menu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <a href="/details">Job Details</a>
           {/* <DropdownMenu /> */}
           {isDropdownVisible && <DropdownMenu />}
        </div>
      </li>
      <li>
        <a href="/ranking">Ranking</a>
        </li>
        <li>
          <a href="/allocation">Allocations</a>
        </li>
      </ul>
    </nav>
  );
}
