import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @param searchByProperty search by a specific property
   * @returns list of elements filtered by search text or []
   */
  transform(items: any[], searchText: string, searchByProperty?: (item: any) => string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase();

    return items.filter(x => {
      if (!searchByProperty) {
        return x.toLocaleLowerCase().includes(searchText);
      }

      return searchByProperty(x).toLocaleLowerCase().includes(searchText);
    });
  }
}