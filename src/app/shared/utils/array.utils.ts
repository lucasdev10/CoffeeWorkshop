/**
 * Utilitários para manipulação de arrays
 */
export class ArrayUtils {
  /**
   * Remove duplicatas de array
   */
  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  /**
   * Remove duplicatas por propriedade
   */
  static uniqueBy<T>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  /**
   * Agrupa array por propriedade
   */
  static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
          result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
      },
      {} as Record<string, T[]>,
    );
  }

  /**
   * Ordena array por propriedade
   */
  static sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Divide array em chunks
   */
  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Embaralha array
   */
  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Retorna item aleatório do array
   */
  static random<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Calcula soma de propriedade numérica
   */
  static sum<T>(array: T[], key: keyof T): number {
    return array.reduce((sum, item) => sum + Number(item[key]), 0);
  }

  /**
   * Calcula média de propriedade numérica
   */
  static average<T>(array: T[], key: keyof T): number {
    if (array.length === 0) return 0;
    return this.sum(array, key) / array.length;
  }

  /**
   * Encontra valor mínimo
   */
  static min<T>(array: T[], key: keyof T): number {
    if (array.length === 0) return 0;
    return Math.min(...array.map((item) => Number(item[key])));
  }

  /**
   * Encontra valor máximo
   */
  static max<T>(array: T[], key: keyof T): number {
    if (array.length === 0) return 0;
    return Math.max(...array.map((item) => Number(item[key])));
  }
}
