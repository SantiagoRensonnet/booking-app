export const PAGE_SIZE = 10;

export const getPaginationInfo = ({
  page,
  count = Infinity,
  zero_index = false,
}) => ({
  from: (page - 1) * PAGE_SIZE + (zero_index ? 0 : 1),
  to: Math.min(page * PAGE_SIZE - (zero_index ? 1 : 0), count),
});
