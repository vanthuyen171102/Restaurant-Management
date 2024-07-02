import clsx from "clsx";
import React, { useState } from "react";

const Tabs = ({ children, className, paddingX }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="flex flex-col h-full">
      <ul
        className={clsx(
          "flex m-0 px-6 list-none flex-wrap border-b border-[rgb(60,78,113)]",
          className
        )}
        role="tablist"
      >
        {React.Children.map(children, (child, index) => (
          <li
            className={clsx(
              "flex items-center mr-1 justify-center cursor-pointer border-b-0 border-[rgba(218,224,236,0.2)] rounded-t-md",
              child.props.className,
              { border: activeTab === index },
              { "text-[rgb(235,238,244)]": activeTab === index },
              { "text-[rgba(235,238,244,0.5)]": activeTab !== index }
            )}
            onClick={() => handleTabClick(index)}
            disabled={child.props.disabled}
            role="presentation"
          >
            <a
              role="tab"
              tabIndex={index - 1}
              className={clsx("block px-4 py-2 text-sm", {
                disabled: child.props.disabled,
              })}
            >
              {child.props.title}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex-1 text-[rgb(235,238,244)] overflow-y-auto">
        {React.Children.map(children, (child, index) => (
          <div
            className={clsx(
              "w-full overflow-y-auto",
              { block: activeTab === index },
              { hidden: activeTab !== index }
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
