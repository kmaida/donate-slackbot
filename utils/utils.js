/*------------------
        UTILS
------------------*/

const utils = {
  /*----
    Async forEach
    @Param: array to iterate over
    @Param: function callback to await
  ----*/
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  },
  /*----
    Is the string a valid URL?
    @Param: string
    @Return: boolean
  ----*/
  validUrl(input) {
    const regex = new RegExp(/((?:[A-Za-z]{3,9})(?::\/\/|@)(?:(?:[A-Za-z0-9\-.]+[.:])|(?:www\.|[-;:&=+$,\w]+@))(?:[A-Za-z0-9.-]+)(?:[/\-+=&;%@.\w_~()]*)(?:[.!/\\\w-?%#~&=+()]*))/g);
    const cleanStr = input.toString().trim();
    return cleanStr.match(regex);
  },
  /*----
    Does the object have properties?
    @Param: object
    @Return: boolean
  ----*/
  objNotEmpty(obj) {
    return Object.keys(obj).length && obj.constructor === Object;
  },
};

module.exports = utils;
