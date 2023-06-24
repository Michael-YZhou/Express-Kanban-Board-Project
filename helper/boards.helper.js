// Move an array element from one position to another
// https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
function arrayMove(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}

module.exports = arrayMove;
