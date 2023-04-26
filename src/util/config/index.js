const gridCfg = {
  loading: false,
  totalCount: 0,
  page: 1,
  pageCount: 10,
  itemsPerPage: 15,
  options: {},
  size: 15,
};

const JO_code = [
  { code: "JO_WAIT", name: "대기" },
  { code: "JO_ING", name: "진행중" },
  { code: "JO_DONE", name: "완료" },
];

const JOD_code = [
  { code: "JOD_WAIT", name: "대기" },
  { code: "JOD_SPROUT", name: "발아" },
  { code: "JOD_SEED1", name: "1차육묘" },
  { code: "JOD_GRAFT", name: "접목활착" },
  { code: "JOD_SEED2", name: "2차육묘" },
  { code: "JOD_DONE", name: "완료" },
];

export { gridCfg, JO_code, JOD_code };
