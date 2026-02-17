// © 2025 Divhunt GmbH — Licensed under the Divhunt Framework License. See LICENSE for terms.

const DivhuntValidate =
{
    ValidateEmail(email)
    {
        if (typeof email !== 'string')
        {
            return false;
        }

        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return pattern.test(email) && email.length <= 254 && !email.includes('..') &&!email.startsWith('.') && !email.endsWith('.');
    },

    ValidatePassword(password, options = {})
    {
        if (typeof password !== 'string')
        {
            return { valid: false, errors: ['Password must be a string'] };
        }

        const config = {
            minLength: options.minLength || 8,
            maxLength: options.maxLength || 128,
            requireUppercase: options.requireUppercase !== false,
            requireLowercase: options.requireLowercase !== false,
            requireNumbers: options.requireNumbers !== false,
            requireSpecial: options.requireSpecial !== false,
            specialChars: options.specialChars || '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        const errors = [];

        if (password.length < config.minLength)
        {
            errors.push(`Password must be at least ${config.minLength} characters long`);
        }

        if (password.length > config.maxLength)
        {
            errors.push(`Password must be no more than ${config.maxLength} characters long`);
        }

        if (config.requireUppercase && !/[A-Z]/.test(password))
        {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (config.requireLowercase && !/[a-z]/.test(password))
        {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (config.requireNumbers && !/\d/.test(password))
        {
            errors.push('Password must contain at least one number');
        }

        if (config.requireSpecial)
        {
            const specialRegex = new RegExp(`[${config.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);

            if (!specialRegex.test(password))
            {
                errors.push('Password must contain at least one special character');
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
};

export default DivhuntValidate;