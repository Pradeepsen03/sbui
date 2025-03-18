"use client";
// Import required modules
import { Fragment, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { ListGroup, Card, Image, Badge } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

// Import routes file
import { DashboardMenu } from "routes/DashboardRoutes";

// const userRole = 'admin';

const filterMenuByRole = (menu, role) => {
  return menu
    .filter((item) => !item.role || item.role.includes(role))
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuByRole(item.children, role) : null,
    }));
};

// console.log("filterMenuByRole",filterMenuByRole(DashboardMenu, userRole))

const NavbarVertical = (props) => {
  const [userRoles, setUserRoles] = useState("USER");
  const location = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    async function fetchRole() {
      try {
        const response = await fetch("/api/roleCheck");
        const data = await response.json();
        console.log("ddddd", data.user);
        if (response.ok) {
          setUserRoles(data.user);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
      // setLoading(false);
    }

    fetchRole();
  }, []);

  // Filter menu items based on user role
  const filteredMenu = filterMenuByRole(DashboardMenu, userRoles);

  console.log("userRoles", userRoles);

  const CustomToggle = ({ children, eventKey, icon }) => {
    const { activeEventKey } = useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(eventKey);
    const isCurrentEventKey = activeEventKey === eventKey;

    return (
      <div className="nav-item">
        <Link
          href="#"
          className="nav-link text-secondary "
          onClick={decoratedOnClick}
          aria-expanded={isCurrentEventKey}
        >
          {icon && <i className={`nav-icon fe fe-${icon} me-2`}></i>} {children}
        </Link>
      </div>
    );
  };

  const generateLink = (item) => {
    return (
      <Link
        href={item.link}
        className={`nav-link ${location === item.link ? "active" : ""}`}
        onClick={(e) =>
          isMobile ? props.onClick(!props.showMenu) : props.showMenu
        }
      >
        {item.name}
        {item.badge && (
          <Badge className="ms-1" bg={item.badgecolor || "primary"}>
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <Fragment>
      <SimpleBar style={{ maxHeight: "100vh" }}>
        <div className="nav-scroller">
          <Link href="/" className="navbar-brand">
            <h1 className="text-white fs-3 fw-bold">SB UI</h1>
          </Link>
        </div>

        {/* Dashboard Menu */}
        <Accordion
          defaultActiveKey="0"
          as="ul"
          className="navbar-nav flex-column"
        >
          {filteredMenu.map((menu, index) => (
            <Fragment key={index}>
              {menu.grouptitle ? (
                <Card bsPrefix="nav-item">
                  <div className="navbar-heading">{menu.title}</div>
                </Card>
              ) : menu.children ? (
                <>
                  <CustomToggle eventKey={index} icon={menu.icon}>
                    {menu.title}
                    {menu.badge && (
                      <Badge className="ms-1" bg={menu.badgecolor || "primary"}>
                        {menu.badge}
                      </Badge>
                    )}
                  </CustomToggle>
                  <Accordion.Collapse
                    eventKey={index}
                    as="li"
                    bsPrefix="nav-item"
                  >
                    <ListGroup as="ul" bsPrefix="" className="nav flex-column">
                      {menu.children.map((subItem, subIndex) => (
                        <ListGroup.Item
                          as="li"
                          bsPrefix="nav-item"
                          key={subIndex}
                        >
                          {subItem.children ? (
                            <Accordion
                              defaultActiveKey="0"
                              className="navbar-nav flex-column"
                            >
                              <CustomToggle eventKey={subIndex}>
                                {subItem.title}
                                {subItem.badge && (
                                  <Badge
                                    className="ms-1"
                                    bg={subItem.badgecolor || "primary"}
                                  >
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </CustomToggle>
                              <Accordion.Collapse
                                eventKey={subIndex}
                                bsPrefix="nav-item"
                              >
                                <ListGroup
                                  as="ul"
                                  bsPrefix=""
                                  className="nav flex-column"
                                >
                                  {subItem.children.map(
                                    (nestedItem, nestedIndex) => (
                                      <ListGroup.Item
                                        key={nestedIndex}
                                        as="li"
                                        bsPrefix="nav-item"
                                      >
                                        {generateLink(nestedItem)}
                                      </ListGroup.Item>
                                    )
                                  )}
                                </ListGroup>
                              </Accordion.Collapse>
                            </Accordion>
                          ) : (
                            generateLink(subItem)
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Collapse>
                </>
              ) : (
                <Card bsPrefix="nav-item">
                  <Link
                    href={menu.link}
                    className={`nav-link ${
                      location === menu.link ? "active" : ""
                    }`}
                  >
                    {menu.icon && (
                      <i className={`nav-icon fe fe-${menu.icon} me-2`}></i>
                    )}
                    {menu.title}
                    {menu.badge && (
                      <Badge className="ms-1" bg={menu.badgecolor || "primary"}>
                        {menu.badge}
                      </Badge>
                    )}
                  </Link>
                </Card>
              )}
            </Fragment>
          ))}
        </Accordion>
        {/* End of Dashboard Menu */}
      </SimpleBar>
    </Fragment>
  );
};

export default NavbarVertical;
