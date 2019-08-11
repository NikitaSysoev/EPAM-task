export function flatten(arr) {
  return arr.reduce((acc, item) => {
    if (item.hasOwnProperty("sub")) {
      acc = acc.concat(flatten(item.sub));
    }
    acc = acc.concat(item);
    return acc;
  }, []);
}

export function findObj(array, id) {
  if (typeof array != "undefined") {
    for (var i = 0; i < array.length; i++) {
      if (String(array[i].id) === String(id)) return array[i];
      var a = findObj(array[i].sub, id);
      if (a !== null) {
        return a;
      }
    }
  }
  return null;
}

export function deepClone(obj) {
  return new Notification("", { data: obj, silent: true }).data;
}
