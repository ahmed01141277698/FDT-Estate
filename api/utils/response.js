export const apiResponse = ({
  res,
  status = 200,
  success = true,
  data = null,
  message = "success",
  code = null,
  errors = [],
}) => {
  const payload = {
    success,
    message,
  };

  if (code) payload.code = code;
  if (data !== null) payload.data = data;
  if (errors.length) payload.errors = errors;

  return res.status(status).json(payload);
};

export const buildPagination = ({ page = 1, limit = 12, total = 0 }) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

  return {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrevious: safePage > 1,
  };
};
