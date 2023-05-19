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
  { code: "SA01", name: "대기" },
  { code: "SA02", name: "진행중" },
  { code: "SA03", name: "완료" },
];

const JOD_code = [
  /*
  { code: "JOD_WAIT", name: "대기" },
  { code: "JOD_SPROUT", name: "발아" },
  { code: "JOD_SEED1", name: "1차육묘" },
  { code: "JOD_GRAFT", name: "접목활착" },
  { code: "JOD_SEED2", name: "2차육묘" },
  { code: "JOD_DONE", name: "완료" },
*/
  { code: "SB01", name: "준비" },
  { code: "SB02", name: "파종" },
  { code: "SB03", name: "발아" },
  { code: "SB04", name: "1차육묘" },
  { code: "SB05", name: "접목" },
  { code: "SB06", name: "활착" },
  { code: "SB07", name: "2차육묘" },
  { code: "SB08", name: "완료" },
];

export { gridCfg, JO_code, JOD_code };
