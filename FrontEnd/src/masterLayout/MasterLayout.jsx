import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getAnomalies ,getMyProfile} from "../services/authService"; 
import { format, parseISO } from 'date-fns';

const MasterLayout = ({ children }) => {
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation(); 
const navigate = useNavigate();

const [userProfile, setUserProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [newNotificationCount, setNewNotificationCount] = useState(0);

    const fetchNotifications = async () => {
        // --- THIS IS THE FIX ---
        // First, check if a token exists. If not, do nothing.
        const token = localStorage.getItem('token');
        if (!token) {
            setNewNotificationCount(0);
            setNotifications([]);
            return;
        }

        try {
            const [statsRes, anomaliesRes] = await Promise.all([
                getDashboardStats(),
                getAnomalies()
            ]);
            setNewNotificationCount(statsRes.data.newAnomalies);
            setNotifications(anomaliesRes.data.slice(0, 5));
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const [statsRes, anomaliesRes, profileRes] = await Promise.all([
                getDashboardStats(),
                getAnomalies(),
                getMyProfile()
            ]);
            setNewNotificationCount(statsRes.data.newAnomalies);
            setNotifications(anomaliesRes.data.slice(0, 5));
            setUserProfile(profileRes.data); 
        } catch (error) {
            console.error("Erreur lors de la récupération des données du layout:", error);
        }
    };
    useEffect(() => {
      fetchData();
        fetchNotifications(); 
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval); 
    }, []);



const handleLogout = () => {
  localStorage.removeItem('token');
  navigate('/sign-in');
};
  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; 
        }
      });

      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; 
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div>
          <Link to='/dashboard' className='sidebar-logo'>
            <img
              src='assets/images/tt11.svg'
              alt='site logo'
              className='light-logo'
            />
            <img
              src='assets/images/tt12.svg'
              alt='site logo'
              className='dark-logo'
            />
            <img
              src='assets/images/tt50.svg'
              alt='site logo'
              className='logo-icon'
            />
          </Link>
        </div>
        <div className='sidebar-menu-area'>
          <ul className='sidebar-menu' id='sidebar-menu'>
            <li>
              <NavLink to='/dashboard'className={(navData) => (navData.isActive ? "active-page" : "")}> 
                <Icon icon='solar:home-smile-angle-outline' className='menu-icon' />
                <span>Tableau de Bord</span>
            </NavLink>
            </li>
            <li className='sidebar-menu-group-title'>Gestion Telecom</li>
            <li>
              <NavLink
                to='/regions'
                className={(navData) => (navData.isActive ? "active-page" : "")}>
                <Icon icon='solar:map-outline' className='menu-icon' />
                <span>Gestion des Régions</span>
              </NavLink>
            </li>

          <li>
              <NavLink to='/sites' className={(navData) => (navData.isActive ? "active-page" : "")}>
                <Icon icon='solar:server-outline' className='menu-icon' />
                <span>Gestion des Sites</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/types'  className={(navData) => (navData.isActive ? "active-page" : "")}><Icon icon='solar:tag-outline' className='menu-icon' /><span>Gestion des Types</span></NavLink>
            </li>
            <li>
              <NavLink to='/vlans' className={(navData) => (navData.isActive ? "active-page" : "")}><Icon icon='solar:link-round-angle-outline' className='menu-icon' /><span>Gestion des VLANs</span></NavLink>
            </li>
            <li>
              <NavLink to='/ip-addresses' className={(navData) => (navData.isActive ? "active-page" : "")}><Icon icon='solar:server-square-outline' className='menu-icon' /><span>Gestion des IPs</span></NavLink>
              </li>
              <li>
                <NavLink to='/anomalies' className={(navData) => (navData.isActive ? "active-page" : "")}>
                  <Icon icon='solar:shield-check-outline' className='menu-icon' />
                  <span>Détection d'Anomalies</span>
                </NavLink>
              </li>

            <li className='sidebar-menu-group-title'>Application</li>
            {/* Users Dropdown */}
            <li className='dropdown'>
              <Link to='#'>
                <Icon
                  icon='flowbite:users-group-outline'
                  className='menu-icon'
                />
                <span>Administrateurs</span>
              </Link>
              <ul className='sidebar-submenu'>
                <li>
                  <NavLink
                    to='/admins-list'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Liste des Admins
                  </NavLink>
                </li>
               
                <li>
                  <NavLink
                    to='/add-admin'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                    Ajouter un Admin
                  </NavLink>
                </li>
               
              </ul>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className='navbar-header'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-4'>
                <button
                  type='button'
                  className='sidebar-toggle'
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon='iconoir:arrow-right'
                      className='icon text-2xl non-active'
                    />
                  ) : (
                    <Icon
                      icon='heroicons:bars-3-solid'
                      className='icon text-2xl non-active '
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type='button'
                  className='sidebar-mobile-toggle'
                >
                  <Icon icon='heroicons:bars-3-solid' className='icon' />
                </button>
                <form className='navbar-search'>
                  <input type='text' name='search' placeholder='Search' />
                  <Icon icon='ion:search-outline' className='icon' />
                </form>
              </div>
            </div>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-3'>
                {/* ThemeToggleButton */}
                <ThemeToggleButton />
                <div className='dropdown d-none d-sm-inline-block'>
                  
               
                </div>
               
                <div className='dropdown'>
                                    <button className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center' type='button' data-bs-toggle='dropdown'>
                                        <Icon icon='iconoir:bell' className='text-primary-light text-xl' />
                                        {newNotificationCount > 0 && <span className="indicator-pulse"></span>}
                                    </button>
                                    <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                                        <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                                            <div><h6 className='text-lg text-primary-light fw-semibold mb-0'>Notifications</h6></div>
                                            <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                                                {newNotificationCount}
                                            </span>
                                        </div>
                                        <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                                            {notifications.length > 0 ? notifications.map(notif => (
                                                <Link to='/anomalies' key={notif.id} className={`px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between ${notif.status === 'NEW' ? 'bg-neutral-50' : ''}`}>
                                                    <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                                        <span className='w-44-px h-44-px bg-danger-subtle text-danger-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                                                            <Icon icon='lucide:shield-alert' className='icon text-xxl' />
                                                        </span>
                                                        <div>
                                                            <h6 className='text-md fw-semibold mb-4 text-capitalize'>{notif.anomaly_type.replace(/_/g, " ")}</h6>
                                                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                                                                IP: {notif.details.ip_address} - {notif.details.failed_attempts} tentatives
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className='text-sm text-secondary-light flex-shrink-0'>
                                                        {format(parseISO(notif.timestamp), 'HH:mm')}
                                                    </span>
                                                </Link>
                                            )) : (
                                                <p className="text-center text-muted p-4">Aucune nouvelle notification</p>
                                            )}
                                        </div>
                                        <div className='text-center py-12 px-16'>
                                            <Link to='/anomalies' className='text-primary-600 fw-semibold text-md'>
                                                Voir Toutes les Alertes
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                {/* Notification dropdown end */}
                <div className='dropdown'>
                  <button
                    className='d-flex justify-content-center align-items-center rounded-circle'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src={userProfile?.avatar_url ? `http://localhost:3001${userProfile.avatar_url}` : '/assets/images/user.png'}
                      alt='image_user'
                      className='w-40-px h-40-px object-fit-cover rounded-circle'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                          {userProfile ? `${userProfile.prenom} ${userProfile.nom}` : 'Chargement...'}
                        </h6>
                        <span className='text-secondary-light fw-medium text-sm'>
                           {userProfile?.email}
                        </span>
                      </div>
                      <button type='button' className='hover-text-danger'>
                        <Icon
                          icon='radix-icons:cross-1'
                          className='icon text-xl'
                        />
                      </button>
                    </div>
                    <ul className='to-top-list'>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/profile'
                        >
                          <Icon
                            icon='solar:user-linear'
                            className='icon text-xl' 
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                     
                     <li>
                   
                      <button
                        type="button" 
                        className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }} 
                      >
                        <Icon icon='lucide:power' className='icon text-xl' />{" "}
                        Log Out
                      </button>
                   
                    </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='dashboard-main-body'>{children}</div>

        {/* Footer section */}
        <footer className='d-footer'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <p className='mb-0'>© 2025 PFE TT</p>
            </div>
            <div className='col-auto'>
              <p className='mb-0'>
                Made by <span className='text-primary-600'>Amel</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
