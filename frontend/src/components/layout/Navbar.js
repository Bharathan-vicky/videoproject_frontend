// src/components/layout/Navbar.jsx
import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Dialog,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Fade,
  InputAdornment
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Business,
  Analytics,
  CloudUpload,
  Assessment,
  ExitToApp,
  Person,
  Edit,
  Save,
  Cancel,
  Close,
  Visibility,
  VisibilityOff,
  SmartDisplay,
  SpaceDashboard,
  AddToQueue,
  UploadFile
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

// Professional BMW Theme Colors
const BMW = {
  primary: '#1C69D4',
  primaryDark: '#0D47A1',
  primaryLight: '#5B9EED',
  primaryUltraLight: '#EBF4FF',
  white: '#FFFFFF',
  background: '#FAFBFC',
  surface: '#F5F7FA',
  border: '#E1E6ED',
  textPrimary: '#0A1929',
  textSecondary: '#3E5060',
  textTertiary: '#6B7A90',
  accent: '#00A5E0',
  success: '#00A86B',
  error: '#D32F2F'
};

// Menu configuration
const MENU_BY_ROLE = {
  super_admin: [
    { text: 'Dashboard', path: '/super-admin/dashboard', icon: SpaceDashboard },
    { text: 'User Management', path: '/super-admin/users', icon: People },
    { text: 'Dealer Network', path: '/super-admin/dealers', icon: Business }
  ],
  dealer_admin: [
    { text: 'Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Results', path: '/dealer/results', icon: Assessment },
    { text: 'User Management', path: '/dealer/users', icon: People }
  ],
  dealer_user: [
    { text: 'Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Results', path: '/dealer/results', icon: Assessment }
  ],
};

const ROLE_LABEL = {
  super_admin: 'Super Admin',
  dealer_admin: 'Dealer Admin',
  dealer_user: 'Dealer User',
};

const ROLE_COLOR = {
  super_admin: BMW.primary,
  dealer_admin: BMW.accent,
  dealer_user: BMW.success,
};

export default function Navbar() {
  const { user, role, logout, updateProfile } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [userAnchor, setUserAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editBoxOpen, setEditBoxOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (p) => location.pathname.startsWith(p);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const openUserMenu = (e) => setUserAnchor(e.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleEditClick = () => {
    setEditForm({
      username: user?.username || '',
      email: user?.email || '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setEditBoxOpen(true);
    closeUserMenu();
  };

  const handleEditChange = (field) => (e) => {
    setEditForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSaveProfile = async () => {
    // Validation
    if (!editForm.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!editForm.email.trim()) {
      setError('Email is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation if passwords are provided
    if (editForm.newPassword || editForm.confirmPassword) {
      if (editForm.newPassword !== editForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (editForm.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
      };

      // Only include new password if provided
      if (editForm.newPassword) {
        updateData.new_password = editForm.newPassword;
      }

      await updateProfile(updateData);

      setSuccess('Profile updated successfully!');

      // Close box after success message
      setTimeout(() => {
        setEditBoxOpen(false);
        setEditForm({
          username: '',
          email: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess('');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBoxOpen(false);
    setEditForm({
      username: '',
      email: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: BMW.white }}>
      {/* Drawer Header */}
      <Box sx={{
        p: 3,
        background: BMW.white,
        borderBottom: `1px solid ${BMW.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{
          height: 50,
          width: 50,
          bgcolor: BMW.primary,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 2
        }}>
          <SmartDisplay sx={{ fontSize: 30 }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{
            width: 36,
            height: 36,
            bgcolor: 'rgba(255,255,255,0.2)',
            fontSize: '15px',
            fontWeight: 600,
            color: 'white'
          }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', lineHeight: 1.2 }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {ROLE_LABEL[role] || 'User'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ p: 2 }}>
        {(MENU_BY_ROLE[role] || []).map(({ text, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={RouterLink}
            to={path}
            selected={isActive(path)}
            onClick={toggleDrawer}
            sx={{
              mb: 0.5,
              borderRadius: 1.5,
              '&.Mui-selected': {
                background: BMW.primaryUltraLight,
                color: BMW.primary,
                '& .MuiListItemIcon-root': { color: BMW.primary },
                '&:hover': {
                  background: BMW.primaryUltraLight
                }
              },
              '&:hover': {
                backgroundColor: BMW.surface
              }
            }}
          >
            <ListItemIcon sx={{
              color: isActive(path) ? BMW.primary : BMW.textTertiary,
              minWidth: 40
            }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontWeight: isActive(path) ? 600 : 500,
                fontSize: '0.9375rem',
                color: isActive(path) ? BMW.primary : BMW.textPrimary
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Main AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: BMW.white,
          borderBottom: `1px solid ${BMW.border}`,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{
          justifyContent: 'space-between',
          minHeight: { xs: '64px', sm: '72px' },
          px: { xs: 2, sm: 3 }
        }}>
          {/* Left: Logo + Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  color: BMW.textPrimary,
                  '&:hover': { background: BMW.surface }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none'
              }}
            >
              <Box
                sx={{
                  height: 40,
                  width: 40,
                  bgcolor: BMW.primary,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <SmartDisplay />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: BMW.primary,
                    display: { xs: 'block', sm: 'block' },
                    lineHeight: 1.2
                  }}
                >
                  {/* ✅ DYNAMIC: Show CITNOW for super_admin, showroom name for dealer_admin */}
                  {role === 'super_admin' ? 'FOCUS' : (user?.showroom_name || 'Dealer Portal')}
                </Typography>
                {role === 'dealer_admin' && user?.showroom_name && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: BMW.textSecondary,
                      display: { xs: 'none', sm: 'block' },
                      fontWeight: 500
                    }}
                  >
                    Powered by Focus
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Center: Desktop Navigation */}
          {!isMobile && (
            <Box sx={{
              display: 'flex',
              gap: 0.5,
              background: 'rgba(0,0,0,0.03)',
              borderRadius: 50,
              p: 0.75,
              border: `1px solid ${BMW.border}`,
              backdropFilter: 'blur(10px)'
            }}>
              {(MENU_BY_ROLE[role] || []).map(({ text, path, icon: Icon }) => (
                <NavButton
                  key={path}
                  to={path}
                  active={isActive(path)}
                  icon={Icon}
                >
                  {text}
                </NavButton>
              ))}
            </Box>
          )}

          {/* Right: Role + User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Role Chip */}
            <Chip
              label={ROLE_LABEL[role] || 'User'}
              size="small"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                background: `${ROLE_COLOR[role] || BMW.primary}15`,
                color: ROLE_COLOR[role] || BMW.primary,
                fontWeight: 700,
                height: 28,
                fontSize: '0.75rem',
                border: `1px solid ${ROLE_COLOR[role] || BMW.primary}30`
              }}
            />

            {/* User Avatar */}
            <Tooltip title="Account">
              <IconButton
                onClick={openUserMenu}
                sx={{
                  p: 0.5,
                  border: `2px solid ${BMW.border}`,
                  '&:hover': {
                    borderColor: BMW.primary,
                    background: BMW.primaryUltraLight
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: BMW.primary,
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  <Person />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            border: 'none'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={closeUserMenu}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            border: `1px solid ${BMW.border}`,
            borderRadius: 2
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} color={BMW.textPrimary}>
            {user?.username || 'User'}
          </Typography>
          <Typography variant="caption" color={BMW.textSecondary}>
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
        <Divider />

        {/* Edit Profile Menu Item */}
        <MenuItem
          onClick={handleEditClick}
          sx={{
            color: BMW.textPrimary,
            py: 1.5,
            '&:hover': {
              background: BMW.surface
            }
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: BMW.textSecondary }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Edit Profile</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => { closeUserMenu(); logout(); }}
          sx={{
            color: BMW.textPrimary,
            py: 1.5,
            '&:hover': {
              background: BMW.surface
            }
          }}
        >
          <ListItemIcon>
            <ExitToApp fontSize="small" sx={{ color: BMW.textSecondary }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Compact Edit Profile Box (Top-Right Corner) */}
      <Dialog
        open={editBoxOpen}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)'
          }
        }}
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 4,
            border: `1px solid ${BMW.border}`,
            background: BMW.white,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        {/* Header */}
        <Box sx={{
          p: 3,
          background: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              p: 1,
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Person sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Edit Profile
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Update your personal information
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCancelEdit}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              {/* Username */}
              <TextField
                label="Username"
                value={editForm.username}
                onChange={handleEditChange('username')}
                fullWidth
                variant="outlined"
                disabled={loading}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />

              {/* Email */}
              <TextField
                label="Email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange('email')}
                fullWidth
                variant="outlined"
                disabled={loading}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Box>

            <Divider sx={{ my: 1 }}>
              <Chip label="Security" size="small" sx={{ bgcolor: BMW.surface, fontWeight: 600 }} />
            </Divider>

            {/* New Password */}
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={editForm.newPassword}
              onChange={handleEditChange('newPassword')}
              fullWidth
              variant="outlined"
              disabled={loading}
              placeholder="Leave empty to keep current password"
              InputProps={{
                sx: { borderRadius: 2 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={editForm.confirmPassword}
              onChange={handleEditChange('confirmPassword')}
              fullWidth
              variant="outlined"
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 2 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Actions */}
          <Box sx={{
            display: 'flex',
            gap: 2,
            mt: 4,
            justifyContent: 'flex-end',
            pt: 3,
            borderTop: `1px solid ${BMW.border}`
          }}>
            <Button
              onClick={handleCancelEdit}
              size="large"
              disabled={loading}
              sx={{
                color: BMW.textSecondary,
                fontWeight: 600,
                px: 3,
                '&:hover': { background: BMW.surface }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              size="large"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                boxShadow: BMW.shadowMd
                // Gradient styles are now global in theme
              }}
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Toolbar spacer */}
      <Toolbar sx={{ minHeight: { xs: '64px', sm: '72px' } }} />
    </>
  );
}

// Navigation Button Component
function NavButton({ to, icon: Icon, active, children }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2.5,
          py: 1.25,
          borderRadius: 50,
          color: active ? BMW.primary : BMW.textSecondary,
          background: active ? BMW.white : 'transparent',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: active ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: active ? BMW.white : 'rgba(255,255,255,0.5)',
            color: BMW.primary,
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'scale(0.98)'
          }
        }}
      >
        {Icon && <Icon sx={{
          fontSize: 20,
          transition: 'transform 0.3s ease',
          transform: active ? 'scale(1.1)' : 'scale(1)'
        }} />}
        <Typography variant="body2" fontWeight={active ? 700 : 600} sx={{ letterSpacing: '0.01em' }}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
}
