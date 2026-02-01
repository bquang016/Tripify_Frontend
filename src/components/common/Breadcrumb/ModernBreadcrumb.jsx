import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const ModernBreadcrumb = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
        
        {/* Nút Home */}
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[rgb(40,169,224)] transition-colors"
          >
            <Home size={16} className="mr-1 mb-0.5" />
            Trang chủ
          </Link>
        </li>

        {/* Các Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRight size={16} className="text-gray-300 mx-1" />
                
                {isLast ? (
                  <span className="ml-1 text-sm font-semibold text-[rgb(40,169,224)] truncate max-w-[200px] md:max-w-xs">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="ml-1 text-sm font-medium text-gray-500 hover:text-[rgb(40,169,224)] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ModernBreadcrumb;