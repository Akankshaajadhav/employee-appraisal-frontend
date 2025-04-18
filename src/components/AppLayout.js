// import React, { useState } from 'react';
// import { 
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   CssBaseline,
//   Divider
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import AssessmentIcon from '@mui/icons-material/Assessment';

// // Width of the drawer when open
// const drawerWidth = 240;

// /**
//  * AppLayout component that adds a sidebar navigation
//  * @param {Object} props
//  * @param {React.ReactNode} props.children - The page content to render
//  * @param {Function} props.onNavigate - Function to call when a nav item is clicked
//  * @param {string} props.activePage - ID of the currently active page
//  */
// const AppLayout = ({ children, onNavigate, activePage }) => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const menuItems = [
//     { 
//       text: 'HR Dashboard', 
//       icon: <DashboardIcon />, 
//       id: 'hr-dashboard' 
//     },
//     { 
//       text: 'Assessment', 
//       icon: <AssessmentIcon />, 
//       id: 'assessment' 
//     }
//   ];

//   const drawer = (
//     <div>
//       <Toolbar>
//         <Typography variant="h6" noWrap component="div">
//           HR Portal
//         </Typography>
//       </Toolbar>
//       <Divider />
//       <List>
//         {menuItems.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton 
//               selected={activePage === item.id}
//               onClick={() => {
//                 onNavigate(item.id);
//                 if (mobileOpen) handleDrawerToggle();
//               }}
//             >
//               <ListItemIcon>
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div">
//             Employee Appraisal System
//           </Typography>
//         </Toolbar>
//       </AppBar>
      
//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//         aria-label="navigation menu"
//       >
//         {/* Mobile drawer */}
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile
//           }}
//           sx={{
//             display: { xs: 'block', sm: 'none' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//         >
//           {drawer}
//         </Drawer>
        
//         {/* Desktop drawer - always visible */}
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: 'none', sm: 'block' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>
      
//       {/* Main content */}
//       <Box
//         component="main"
//         sx={{ 
//           flexGrow: 1, 
//           p: 3, 
//           width: { sm: `calc(100% - ${drawerWidth}px)` }, 
//           marginTop: '64px' // Account for AppBar height
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default AppLayout;

import React, { useState } from 'react';
import { 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  CssBaseline,
  Divider,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Width of the drawer when open
const drawerWidth = 240;

/**
 * AppLayout component that adds a sidebar navigation
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page content to render
 * @param {Function} props.onNavigate - Function to call when a nav item is clicked
 * @param {string} props.activePage - ID of the currently active page
 */
const AppLayout = ({ children, onNavigate, activePage }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Define Toolbar to avoid error
  const Toolbar = props => <div style={{ padding: '16px'}} {...props} />;
  const menuItems = [
    { 
      text: 'Appraisal Cycle Setup', 
      icon: <DashboardIcon />, 
      id: 'hr-dashboard' 
    },
    { 
      text: 'Assessment', 
      icon: <AssessmentIcon />, 
      id: 'assessment' 
    }
  ];

  const drawer = (
    <div >
      <Toolbar >
        <Typography variant="h6" noWrap component="div" color='primary' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
         Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              selected={activePage === item.id}
              onClick={() => {
                onNavigate(item.id);
                handleDrawerToggle(); // Always close drawer on click
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Toggle button for the drawer */}
      <Box sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1200 }}>
        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      
      {/* Drawer - uses temporary variant for both mobile and desktop */}
      <Drawer
        variant="temporary"
        open={open}
        // sx={{color:'primary'}}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance
        }}
        sx={{ 
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;