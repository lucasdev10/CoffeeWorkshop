/**
 * Utilitários para manipulação de strings
 */
export class StringUtils {
  /**
   * Capitaliza primeira letra
   */
  static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Converte para camelCase
   */
  static toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  /**
   * Converte para kebab-case
   */
  static toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Converte para snake_case
   */
  static toSnakeCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  /**
   * Trunca string com ellipsis
   */
  static truncate(str: string, length: number, suffix = '...'): string {
    if (!str || str.length <= length) return str;
    return str.substring(0, length).trim() + suffix;
  }

  /**
   * Remove acentos
   */
  static removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Gera slug a partir de string
   */
  static slugify(str: string): string {
    return this.removeAccents(str)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Mascara email (ex: j***@example.com)
   */
  static maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;

    const maskedName = name.charAt(0) + '***';
    return `${maskedName}@${domain}`;
  }

  /**
   * Mascara telefone (ex: (11) *****-1234)
   */
  static maskPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 11) return phone;

    return `(${cleaned.substring(0, 2)}) *****-${cleaned.substring(7)}`;
  }

  /**
   * Gera string aleatória
   */
  static random(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
