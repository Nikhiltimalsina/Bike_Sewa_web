export interface RegisterDto {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Validation helpers (mirrors Zod on frontend)
export const validateRegisterDto = (body: Partial<RegisterDto>): string[] => {
  const errors: string[] = [];

  if (!body.fullName || body.fullName.trim().length < 2)
    errors.push("Full name must be at least 2 characters");

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.push("Please provide a valid email address");

  if (!body.phone || !/^[0-9]{10}$/.test(body.phone))
    errors.push("Phone number must be exactly 10 digits");

  if (!body.password || body.password.length < 8)
    errors.push("Password must be at least 8 characters");

  if (body.password && !/[A-Z]/.test(body.password))
    errors.push("Password must contain at least one uppercase letter");

  if (body.password && !/[0-9]/.test(body.password))
    errors.push("Password must contain at least one number");

  return errors;
};

export const validateLoginDto = (body: Partial<LoginDto>): string[] => {
  const errors: string[] = [];

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.push("Please provide a valid email address");

  if (!body.password || body.password.trim().length === 0)
    errors.push("Password is required");

  return errors;
};

export const validateUpdateProfileDto = (body: Partial<UpdateProfileDto>): string[] => {
  const errors: string[] = [];

  if (body.fullName !== undefined && body.fullName.trim().length < 2)
    errors.push("Full name must be at least 2 characters");

  if (body.phone !== undefined && !/^[0-9]{10}$/.test(body.phone))
    errors.push("Phone number must be exactly 10 digits");

  // Password change is optional, but if either field is provided, both are required
  if (body.currentPassword || body.newPassword) {
    if (!body.currentPassword)
      errors.push("Current password is required to set a new password");

    if (!body.newPassword || body.newPassword.length < 8)
      errors.push("New password must be at least 8 characters");

    if (body.newPassword && !/[A-Z]/.test(body.newPassword))
      errors.push("New password must contain at least one uppercase letter");

    if (body.newPassword && !/[0-9]/.test(body.newPassword))
      errors.push("New password must contain at least one number");
  }

  return errors;
};