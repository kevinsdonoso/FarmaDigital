import { getUserInfo } from './auth';
import axios from 'axios';

// #11 Registro de auditoría mejorado
export const logUserAction = async (action, details = {}) => {
  try {
    const userInfo = getUserInfo();
    const auditLog = {
      userId: userInfo?.id || 'anonymous',
      userEmail: userInfo?.email || 'unknown',
      action,
      details: {
        ...details,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: sessionStorage.getItem('sessionId') || 'no-session',
        pageUrl: window.location.href,
        referrer: document.referrer
      },
      severity: getSeverityLevel(action),
      category: getCategoryFromAction(action)
    };
    
    // Intentar enviar al backend
    try {
      await axios.post('/api/audit/log', auditLog);
    } catch (apiError) {
      // Si falla, guardar localmente para enviar después
      const localLogs = JSON.parse(localStorage.getItem('pendingAuditLogs') || '[]');
      localLogs.push(auditLog);
      localStorage.setItem('pendingAuditLogs', JSON.stringify(localLogs.slice(-50))); // Mantener solo 50
    }
  } catch (error) {
    console.error('Error logging audit:', error);
  }
};

// #12 Niveles de severidad
const getSeverityLevel = (action) => {
  const severityMap = {
    [auditableActions.LOGIN]: 'info',
    [auditableActions.LOGOUT]: 'info',
    [auditableActions.FAILED_LOGIN]: 'warning',
    [auditableActions.SUSPICIOUS_ACTIVITY]: 'critical',
    [auditableActions.PURCHASE]: 'info',
    [auditableActions.PAYMENT_FAILED]: 'warning',
    [auditableActions.SESSION_EXPIRED]: 'warning',
    [auditableActions.FORM_ERROR]: 'warning',
    [auditableActions.INJECTION_ATTEMPT]: 'critical'
  };
  return severityMap[action] || 'info';
};

// #13 Categorías de acciones
const getCategoryFromAction = (action) => {
  if (action.includes('login') || action.includes('auth')) return 'authentication';
  if (action.includes('purchase') || action.includes('payment')) return 'transaction';
  if (action.includes('suspicious') || action.includes('injection')) return 'security';
  if (action.includes('form')) return 'form_interaction';
  return 'general';
};

// #13 Acciones auditables actualizadas
export const auditableActions = {
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  FAILED_LOGIN: 'failed_login_attempt',
  PURCHASE: 'purchase_made',
  PAYMENT: 'payment_processed',
  PAYMENT_FAILED: 'payment_failed',
  CART_ADD: 'item_added_to_cart',
  CART_REMOVE: 'item_removed_from_cart',
  PROFILE_UPDATE: 'profile_updated',
  PASSWORD_CHANGE: 'password_changed',
  SESSION_EXPIRED: 'session_expired',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  INJECTION_ATTEMPT: 'injection_attempt_detected',
  FORM_SUBMITTED: 'form_submitted_successfully',
  FORM_ERROR: 'form_submission_error',
  PRODUCT_VIEW: 'product_viewed',
  PRODUCT_SEARCH: 'product_searched',
  FILE_UPLOAD: 'file_uploaded',
  UNAUTHORIZED_ACCESS: 'unauthorized_access_attempt'
};

// #14 Función para enviar logs pendientes
export const syncPendingLogs = async () => {
  const pendingLogs = JSON.parse(localStorage.getItem('pendingAuditLogs') || '[]');
  
  if (pendingLogs.length === 0) return;
  
  try {
    await axios.post('/api/audit/batch', { logs: pendingLogs });
    localStorage.removeItem('pendingAuditLogs');
  } catch (error) {
    console.error('Error syncing pending logs:', error);
  }
};

// Sincronizar logs pendientes al cargar la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', syncPendingLogs);
}