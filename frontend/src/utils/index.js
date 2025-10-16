// Utilidades para validación de formularios
export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Email inválido';
  },

  password: (value) => {
    if (value.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return true;
  },

  required: (value) => {
    return value.trim() !== '' || 'Este campo es requerido';
  },

  minLength: (min) => (value) => {
    return value.length >= min || `Debe tener al menos ${min} caracteres`;
  },

  maxLength: (max) => (value) => {
    return value.length <= max || `No puede tener más de ${max} caracteres`;
  },
};

// Utilidades para formateo
export const formatters = {
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatDateShort: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  },

  truncateText: (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
};

// Utilidades para clases CSS
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
