-- Sorts and intervals are Reddit's own uppercase values now
update `sorting`
set `sort` = upper(`sort`),
  `interval` = upper(`interval`);