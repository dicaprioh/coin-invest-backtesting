import React from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalance as PortfolioIcon,
  Analytics as BacktestingIcon,
  TrendingUp as MarketsIcon,
  Psychology as StrategyIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Logout,
  DarkMode,
  LightMode,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@store/index'
import { toggleSidebar, setTheme } from '@store/slices/uiSlice'

const drawerWidth = 240

interface LayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/dashboard' },
  { text: '포트폴리오', icon: <PortfolioIcon />, path: '/portfolio' },
  { text: '백테스팅', icon: <BacktestingIcon />, path: '/backtesting' },
  { text: '마켓', icon: <MarketsIcon />, path: '/markets' },
  { text: '전략', icon: <StrategyIcon />, path: '/strategy' },
  { text: '설정', icon: <SettingsIcon />, path: '/settings' },
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user, logout } = useAuth0()

  const { sidebarOpen, theme: currentTheme } = useSelector((state: RootState) => state.ui)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleDrawerToggle = () => {
    dispatch(toggleSidebar())
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleThemeToggle = () => {
    dispatch(setTheme(currentTheme === 'light' ? 'dark' : 'light'))
    handleProfileMenuClose()
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
    handleProfileMenuClose()
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Coin Invest
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            암호화폐 투자 백테스팅
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar src={user?.picture} alt={user?.name}>
              <AccountCircle />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={sidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleThemeToggle}>
          {currentTheme === 'light' ? <DarkMode /> : <LightMode />}
          <Typography sx={{ ml: 1 }}>
            {currentTheme === 'light' ? '다크 모드' : '라이트 모드'}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout />
          <Typography sx={{ ml: 1 }}>로그아웃</Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Layout