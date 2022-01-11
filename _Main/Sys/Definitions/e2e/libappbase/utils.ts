/**
 * Asynchronous every that allows asynchronous function as its predicate.
 *
 * @param array An array of items
 * @param predicate Asynchronous function to determine if each of the items in the provided array satisfies the criteria
 * @example
 * let testArr: number[] = [10, 20, 3, 40];
 * let isBigEnough = await asyncEvery(testArr, async (num: number) => {
 *   let threshold = await this.getThresholdNo();
 *   return num >= threshold;
 * });
 * // if threshold is 10, isBigEnough is false because 3 is not >= 10.
 * // if threshold is 3, isBigEnough is true.
 */
export const asyncEvery = async <T>(array: T[], predicate: (value: T) => Promise<boolean>): Promise<boolean> => {
  for (let item of array) {
    if (!(await predicate(item))) {
      return false;
    }
  }
  return true;
};

/**
 * Similar to `Array.prototype.filter`, but this supports async actions.
 * @param array An array of items to be filtered
 * @param callback Asynchronous function to perform filtering
 * @returns `T[]` a newly filtered array.
 */
export const asyncFilter = async <T>(array: T[], callback: (value: T, index: number, array: T[]) => Promise<boolean>): Promise<T[]> => {
  const filterMap = await asyncMap(array, callback);
  return array.filter((_: T, index: number) => filterMap[index]);
};

/**
 * Similar to `Array.prototype.map`, but this supports async actions.
 * @template T Type of the item for the array to be mapped from.
 * @template U Type of the item for the mapped array.
 * @param array An array of items to be mapped from.
 * @param callback Asynchronous function to perform an array mapping
 * @returns `U[]` A new mapped array.
 * @example
 * const array = [1, 5, 7, 10];
 * // example to simulate getting some items from online list based on the collection of ids above.
 * const mappedArr = await asyncMap(array, async (id: number) => {
 *   const listItems = await this.getItemsFromList(id);
 *   return listItems;
 * })
 */
export const asyncMap = async <T, U>(array: T[], callback: (value: T, index: number, array: T[]) => Promise<U>): Promise<U[]> => Promise.all(array.map(callback));

/**
 * Find all the HTML elements by HTML tag name from a HTML string
 *
 * @param htmlString Target HTML string to retrieve HTML elements
 * @param tagName Target tag name to find
 * @example this.findHtmlElementByTag(tooltip, 'tr');
 *
 * @return All the html elements found
 */
export const findHtmlElementByTag = (htmlString: string, tagName: string): string[] | null => {
  const htmlElregex = new RegExp(`<${tagName}.*?>(.*?)<\/${tagName}>`, 'g');
  const htmlElements = htmlString.match(htmlElregex);

  return htmlElements;
};

/**
 * Obtains key entries from a given enumerator.
 * @param e `EnumLike`: EnumLike object / enumerator.
 * @returns `string[]`: which consists of key entries.
 * @example
 * enum Example {
 *   A,
 *   B,
 *   C = 'ccc',
 *   D = 1,
 * }
 *
 * getEnumKeyEntries(Example); // returns ['A', 'B', 'C', 'D']
 */
export const getEnumKeyEntries: (e: EnumLike) => string[] = (e: EnumLike): string[] => Object.keys(e).filter((key: string) => isNaN(Number(key)));

/**
 * Obtains value entries from a given enumerator.
 * @param e `EnumLike`: EnumLike object / enumerator.
 * @returns `(string | number)[]`: array which contains string and/or number, which are thee value entries.
 * @example
 * enum Example {
 *   A,
 *   B,
 *   C = 'ccc',
 *   D = 1,
 * }
 *
 * getEnumValueEntries(Example); // returns ['AAA', 'BBB', 'ccc', 1]
 *
 * @summary As per example, if a key is assigned a number value, this method will also returns it.
 *
 * Please filter it yourself to obtain pure string array. :)
 */
export const getEnumValueEntries: (e: EnumLike) => (string | number)[] = (e: EnumLike): (string | number)[] =>
  getEnumKeyEntries(e).map((key: string) => e[key]) as (string | number)[];

/**
 * Get all string element by removing all tag element in HTML string
 *
 * @param htmlString Target HTML string to retrieve only string element
 * @returns Array of string
 */
export const getHtmlContent = (htmlString: string): string[] => {
  const plaintText = htmlString.replace(/((\s+<|<)[^>]+>)|&[^;]+;/g, '~');
  const split = plaintText.split('~');
  const result = split.filter((el: string) => el !== '');
  return result;
};

/**
 * Convert pass-in HTML table formatted tooltip to a Map object with title map to value
 *
 * @param htmlTableFormattedTooltip Target GC Node tooltip which it html table formatted to be convert into Map object
 */
export const getValuePairsFromHtmlTable = (htmlTableFormattedTooltip: string): Map<string, string> => {
  const titleValuePairs: Map<string, string> = new Map();
  const trElements = findHtmlElementByTag(htmlTableFormattedTooltip, 'tr');
  if (trElements) {
    for (const trElement of trElements) {
      const trContents = getHtmlContent(trElement);
      let valueIndex: number;

      if (trContents.length > 0) {
        let indexOfSeperator = trContents.indexOf(':');
        if (indexOfSeperator === -1) {
          const seperator = trContents.filter((trContent: string) => trContent.includes(':'))[0];
          indexOfSeperator = trContents.indexOf(seperator) + 1;
          valueIndex = indexOfSeperator;
        } else {
          valueIndex = indexOfSeperator + 1;
        }
        const title = trContents.slice(0, indexOfSeperator).join('').trim().replace(':', '');
        const value = trContents.slice(valueIndex).join('').trim();
        titleValuePairs.set(title, value);
      }
    }
  }
  return titleValuePairs;
};

/**
 * Get key-value pairs from a HTML table formatted tooltip
 *
 * @param tooltip Target GC Node tooltip with HTML table formatted
 */
export const getTooltipValuePairs = (tooltip: string): Map<string, string> => {
  const trElements = findHtmlElementByTag(tooltip, 'tr');
  const keyValuePairs: Map<string, string> = new Map();
  if (trElements) {
    for (const trElement of trElements) {
      const rowContents = getHtmlContent(trElement);
      if (rowContents.length > 0) {
        const title = rowContents[0].replace(':', '');
        const value = rowContents.length === 2 ? rowContents[1] : '';
        keyValuePairs.set(title, value);
      }
    }
  }
  return keyValuePairs;
};

export const lowercaseFirstLetter = (value: string): string => value.charAt(0).toLowerCase() + value.slice(1);

export enum ActionTriggerType {
  Button,
  ContextMenu,
  Key,
}

/**
 * EnumLike interface that emulates an enumerator.
 */
export interface EnumLike {
  [key: number]: string | number;
}
