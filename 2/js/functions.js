const checkLength = function (check, len) {return check.length <= len};

const isPalindrome = function (check) {
  check = check.replaceAll(' ', '').toLowerCase();
  let reverseStr = '';
  for (let i = check.length-1; i >= 0; i--) {
    reverseStr += check[i];
  }
  return check === reverseStr;
};
