import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe genérico para filtrar arrays
 * Uso: *ngFor="let item of items | filter:searchTerm:'name'"
 *
 * NOTA: Use com cuidado em listas grandes, prefira filtrar no componente
 */
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false, // Impuro para detectar mudanças no array
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], searchText: string, property?: keyof T): T[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      if (property) {
        const value = item[property];
        return String(value).toLowerCase().includes(searchText);
      }

      // Busca em todas as propriedades
      return Object.values(item as object).some((value) =>
        String(value).toLowerCase().includes(searchText),
      );
    });
  }
}
