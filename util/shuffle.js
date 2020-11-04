/**
 * Fisher-Yates Shuffle on an array. Returns a shuffled copy of a given array
 * Doesn't mutate the given array
 *
 * @param {any[]} givenArray array to shuffle
 * @returns {any[]} shuffled array
 */
function shuffle(givenArray) {
  const array = givenArray;
  let count = array.length;
  while (count) {
    array.push(array.splice(Math.floor(Math.random() * count), 1)[0]);
    count -= 1;
  }
  return array;
}

module.exports = shuffle;
