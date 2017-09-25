
function getDayOfTime(dt: Date) {
  let x = new Date(dt);
  x.setHours(0);
  x.setMinutes(0);
  x.setSeconds(0);
  x.setMilliseconds(0);

  return Math.floor(x.getTime() / 1000 / 24 / 3600); // rounds off timezone
}

function isEligible(testDay: Date, lastSent?: Date, lastEligible?: Date) {
  let eligible = false;
  if (!lastSent) {
    eligible = true;
  }

  // was sent last week, but not since
  // key here is not having time drift
  // TODO account for people's time zones
  if (!lastEligible) {
    lastEligible = new Date(0);
  }

  let lastMonday = getDayOfTime(lastEligible); //parseInt(lastEligible || 0);
  let todayRounded = getDayOfTime(testDay);

  // if today is monday  
  //console.log(testDay.getDay(), testDay.getHours(), lastMonday, todayRounded, lastSent, lastSent.getDay());
  if (testDay.getDay() === 1 && testDay.getHours() >= 9) {
    if (todayRounded - lastMonday >= 7) {
      eligible = true;
    }
  }

  return eligible;
}

export { getDayOfTime, isEligible };