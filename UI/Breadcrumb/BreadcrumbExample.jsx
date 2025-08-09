import React from "react";
import { Breadcrumb } from "../../UI/Breadcrumb/Breadcrumb";

function BreadcrumbExample() {
  return (

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: "My Components" },
        ]}
        separator=">"
      />
      
  );
}

export default BreadcrumbExample;