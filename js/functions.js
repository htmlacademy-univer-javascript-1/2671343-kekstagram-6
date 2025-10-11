const checkLength = function (check, len) {return check.length <= len};

const isPalindrome = function (check) {
  check = check.replaceAll(' ', '').toLowerCase();
  let reverseStr = '';
  for (let i = check.length-1; i >= 0; i--) {
    reverseStr += check[i];
  }
  return check === reverseStr;
};

const checkWorkMeetHours = function (workStart, workEnd, meetStart, meetDur) {
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const workStartMin = toMinutes(workStart);
  const workEndMin = toMinutes(workEnd);
  const meetStartMin = toMinutes(meetStart);
  const meetEndMin = meetStartMin + meetDur;

  return meetStartMin >= workStartMin && meetEndMin <= workEndMin;
};
